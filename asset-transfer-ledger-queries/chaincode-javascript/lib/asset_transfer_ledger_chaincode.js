/*
 SPDX-License-Identifier: Apache-2.0
*/

// ====CHAINCODE EXECUTION SAMPLES (CLI) ==================

// ==== Invoke documents ====
// peer chaincode invoke -C CHANNEL_NAME -n document_transfer -c '{"Args":["CreateDoc","document1","blue","35","Tom","100"]}'
// peer chaincode invoke -C CHANNEL_NAME -n document_transfer -c '{"Args":["CreateDoc","document2","red","50","Tom","150"]}'
// peer chaincode invoke -C CHANNEL_NAME -n document_transfer -c '{"Args":["CreateDoc","document3","blue","70","Tom","200"]}'
// peer chaincode invoke -C CHANNEL_NAME -n document_transfer -c '{"Args":["TransferDoc","document2","jerry"]}'
// peer chaincode invoke -C CHANNEL_NAME -n document_transfer -c '{"Args":["TransferDocsBasedOncertificate","blue","jerry"]}'
// peer chaincode invoke -C CHANNEL_NAME -n document_transfer -c '{"Args":["DeleteDoc","document1"]}'

// ==== Query documents ====
// peer chaincode query -C CHANNEL_NAME -n document_transfer -c '{"Args":["ReadDoc","document1"]}'
// peer chaincode query -C CHANNEL_NAME -n document_transfer -c '{"Args":["GetDocsByRange","document1","document3"]}'
// peer chaincode query -C CHANNEL_NAME -n document_transfer -c '{"Args":["GetDocHistory","document1"]}'

// Rich Query (Only supported if CouchDB is used as state database):
// peer chaincode query -C CHANNEL_NAME -n document_transfer -c '{"Args":["QueryDocsByOwner","Tom"]}' output issue
// peer chaincode query -C CHANNEL_NAME -n document_transfer -c '{"Args":["QueryDocs","{\"selector\":{\"owner\":\"Tom\"}}"]}'

// Rich Query with Pagination (Only supported if CouchDB is used as state database):
// peer chaincode query -C CHANNEL_NAME -n document_transfer -c '{"Args":["QueryDocsWithPagination","{\"selector\":{\"owner\":\"Tom\"}}","3",""]}'

// INDEXES TO SUPPORT COUCHDB RICH QUERIES
//
// Indexes in CouchDB are required in order to make JSON queries efficient and are required for
// any JSON query with a sort. Indexes may be packaged alongside
// chaincode in a META-INF/statedb/couchdb/indexes directory. Each index must be defined in its own
// text file with extension *.json with the index definition formatted in JSON following the
// CouchDB index JSON syntax as documented at:
// http://docs.couchdb.org/en/2.3.1/api/database/find.html#db-index
//
// This document transfer ledger example chaincode demonstrates a packaged
// index which you can find in META-INF/statedb/couchdb/indexes/indexOwner.json.
//
// If you have access to the your peer's CouchDB state database in a development environment,
// you may want to iteratively test various indexes in support of your chaincode queries.  You
// can use the CouchDB Fauxton interface or a command line curl utility to create and update
// indexes. Then once you finalize an index, include the index definition alongside your
// chaincode in the META-INF/statedb/couchdb/indexes directory, for packaging and deployment
// to managed environments.
//
// In the examples below you can find index definitions that support document transfer ledger
// chaincode queries, along with the syntax that you can use in development environments
// to create the indexes in the CouchDB Fauxton interface or a curl command line utility.
//

// Index for docType, owner.
//
// Example curl command line to define index in the CouchDB channel_chaincode database
// curl -i -X POST -H "Content-Type: application/json" -d "{\"index\":{\"fields\":[\"docType\",\"owner\"]},\"name\":\"indexOwner\",\"ddoc\":\"indexOwnerDoc\",\"type\":\"json\"}" http://hostname:port/myc1_documents/_index
//

// Index for docType, owner, harvestDate (descending order).
//
// Example curl command line to define index in the CouchDB channel_chaincode database
// curl -i -X POST -H "Content-Type: application/json" -d "{\"index\":{\"fields\":[{\"harvestDate\":\"desc\"},{\"docType\":\"desc\"},{\"owner\":\"desc\"}]},\"ddoc\":\"indexharvestDateSortDoc\", \"name\":\"indexharvestDateSortDesc\",\"type\":\"json\"}" http://hostname:port/myc1_documents/_index

// Rich Query with index design doc and index name specified (Only supported if CouchDB is used as state database):
//   peer chaincode query -C CHANNEL_NAME -n document_transfer -c '{"Args":["QueryDocs","{\"selector\":{\"docType\":\"document\",\"owner\":\"Tom\"}, \"use_index\":[\"_design/indexOwnerDoc\", \"indexOwner\"]}"]}'

// Rich Query with index design doc specified only (Only supported if CouchDB is used as state database):
//   peer chaincode query -C CHANNEL_NAME -n document_transfer -c '{"Args":["QueryDocs","{\"selector\":{\"docType\":{\"$eq\":\"document\"},\"owner\":{\"$eq\":\"Tom\"},\"harvestDate\":{\"$gt\":0}},\"fields\":[\"docType\",\"owner\",\"harvestDate\"],\"sort\":[{\"harvestDate\":\"desc\"}],\"use_index\":\"_design/indexharvestDateSortDoc\"}"]}'

'use strict';

const { Contract } = require('fabric-contract-api');

class Chaincode extends Contract {

  // CreateDoc - create a new document, store into chaincode state
  async CreateDoc(ctx, docID, certificate, transcript,owner,information) {
    const exists = await this.DocExists(ctx, docID);
    if (exists) {
      throw new Error(`The document ${docID} already exists`);
    }

    let document = {
      docType: 'document',
      docID: docID,
      certificate: certificate,
      transcript: transcript,
      owner: owner,
      creator: ctx.clientIdentity.getID(),
      information:information
    };


    // === Save document to state ===
    await ctx.stub.putState(docID, Buffer.from(JSON.stringify(document)));
    let indexName = 'certificate~name';
    let certificateNameIndexKey = await ctx.stub.createCompositeKey(indexName, [document.certificate, document.docID]);

    //  Save index entry to state. Only the key name is needed, no need to store a duplicate copy of the marble.
    //  Note - passing a 'nil' transcript will effectively delete the key from state, therefore we pass null character as transcript
    await ctx.stub.putState(certificateNameIndexKey, Buffer.from('\u0000'));
  }



  // ReadDoc returns the document stored in the world state with given id.
  async ReadDoc(ctx, id) {
    const documentJSON = await ctx.stub.getState(id); // get the document from chaincode state
    if (!documentJSON || documentJSON.length === 0) {
      throw new Error(`Doc ${id} does not exist`);
    }

    return documentJSON.toString();
  }

  // delete - remove a document key/transcript pair from state
  async DeleteDoc(ctx, id) {
    if (!id) {
      throw new Error('Doc name must not be empty');
    }

    let exists = await this.DocExists(ctx, id);
    if (!exists) {
      throw new Error(`Doc ${id} does not exist`);
    }

    // to maintain the certificate~name index, we need to read the document first and get its certificate
    let valAsbytes = await ctx.stub.getState(id); // get the document from chaincode state
    let jsonResp = {};
    if (!valAsbytes) {
      jsonResp.error = `Doc does not exist: ${id}`;
      throw new Error(jsonResp);
    }
    let documentJSON;
    try {
      documentJSON = JSON.parse(valAsbytes.toString());
    } catch (err) {
      jsonResp = {};
      jsonResp.error = `Failed to decode JSON of: ${id}`;
      throw new Error(jsonResp);
    }
    await ctx.stub.deleteState(id); //remove the document from chaincode state

    // delete the index
    let indexName = 'certificate~name';
    let certificateNameIndexKey = ctx.stub.createCompositeKey(indexName, [documentJSON.certificate, documentJSON.docID]);
    if (!certificateNameIndexKey) {
      throw new Error(' Failed to create the createCompositeKey');
    }
    //  Delete index entry to state.
    await ctx.stub.deleteState(certificateNameIndexKey);
  }

  // TransferDoc transfers a document by setting a new owner name on the document
  async TransferDoc(ctx, documentName) {

    let documentAsBytes = await ctx.stub.getState(documentName);
    if (!documentAsBytes || !documentAsBytes.toString()) {
      throw new Error(`Doc ${documentName} does not exist`);
    }
    let documentToTransfer = {};
    try {
      documentToTransfer = JSON.parse(documentAsBytes.toString()); //unmarshal
    } catch (err) {
      let jsonResp = {};
      jsonResp.error = 'Failed to decode JSON of: ' + documentName;
      throw new Error(jsonResp);
    }
    documentToTransfer.owner = ctx.clientIdentity.getID(); //change the owner

    let documentJSONasBytes = Buffer.from(JSON.stringify(documentToTransfer));
    await ctx.stub.putState(documentName, documentJSONasBytes); //rewrite the document
  }

  // GetDocsByRange performs a range query based on the start and end keys provided.
  // Read-only function results are not typically submitted to ordering. If the read-only
  // results are submitted to ordering, or if the query is used in an update transaction
  // and submitted to ordering, then the committing peers will re-execute to guarantee that
  // result sets are stable between endorsement time and commit time. The transaction is
  // invalidated by the committing peers if the result set has changed between endorsement
  // time and commit time.
  // Therefore, range queries are a safe option for performing update transactions based on query results.
  async GetDocsByRange(ctx, startKey, endKey) {

    let resultsIterator = await ctx.stub.getStateByRange(startKey, endKey);
    let results = await this.GetAllResults(resultsIterator, false);

    return JSON.stringify(results);
  }

  // TransferDocBasedOncertificate will transfer documents of a given certificate to a certain new owner.
  // Uses a GetStateByPartialCompositeKey (range query) against certificate~name 'index'.
  // Committing peers will re-execute range queries to guarantee that result sets are stable
  // between endorsement time and commit time. The transaction is invalidated by the
  // committing peers if the result set has changed between endorsement time and commit time.
  // Therefore, range queries are a safe option for performing update transactions based on query results.
  // Example: GetStateByPartialCompositeKey/RangeQuery
  /*
  async TransferDocBycertificate(ctx, certificate, newOwner) {
    // Query the certificate~name index by certificate
    // This will execute a key range query on all keys starting with 'certificate'
    let certificateedDocResultsIterator = await ctx.stub.getStateByPartialCompositeKey('certificate~name', [certificate]);

    // Iterate through result set and for each document found, transfer to newOwner
    let responseRange = await certificateedDocResultsIterator.next();
    while (!responseRange.done) {
      if (!responseRange || !responseRange.transcript || !responseRange.transcript.key) {
        return;
      }

      let objectType;
      let attributes;
      (
        { objectType, attributes } = await ctx.stub.splitCompositeKey(responseRange.transcript.key)
      );

      console.log(objectType);
      let returnedDocName = attributes[1];

      // Now call the transfer function for the found document.
      // Re-use the same function that is used to transfer individual documents
      await this.TransferDoc(ctx, returnedDocName, newOwner);
      responseRange = await certificateedDocResultsIterator.next();
    }
  }
  */

  // QueryDocsByOwner queries for documents based on a passed in owner.
  // This is an example of a parameterized query where the query logic is baked into the chaincode,
  // and accepting a single query parameter (owner).
  // Only available on state databases that support rich query (e.g. CouchDB)
  // Example: Parameterized rich query
  async QueryDocsByOwner(ctx) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = 'document';
    queryString.selector.owner = ctx.clientIdentity.getID();;
    return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); //shim.success(queryResults);
  }

  // Example: Ad hoc rich query
  // QueryDocs uses a query string to perform a query for documents.
  // Query string matching state database syntax is passed in and executed as is.
  // Supports ad hoc queries that can be defined at runtime by the client.
  // If this is not desired, follow the QueryDocsForOwner example for parameterized queries.
  // Only available on state databases that support rich query (e.g. CouchDB)
  /*async QueryDocs(ctx, queryString) {
    return await this.GetQueryResultForQueryString(ctx, queryString);
  }*/
/*
  // GetQueryResultForQueryString executes the passed in query string.
  // Result set is built and returned as a byte array containing the JSON results.
  async GetQueryResultForQueryString(ctx, queryString) {

    let resultsIterator = await ctx.stub.getQueryResult(queryString);
    let results = await this.GetAllResults(resultsIterator, false);

    return JSON.stringify(results);
  }

  // Example: Pagination with Range Query
  // GetDocsByRangeWithPagination performs a range query based on the start & end key,
  // page harvestDate and a bookmark.
  // The number of fetched records will be equal to or lesser than the page harvestDate.
  // Paginated range queries are only valid for read only transactions.
  async GetDocsByRangeWithPagination(ctx, startKey, endKey, pageharvestDate, bookmark) {

    const { iterator, metadata } = await ctx.stub.getStateByRangeWithPagination(startKey, endKey, pageharvestDate, bookmark);
    const results = await this.GetAllResults(iterator, false);

    results.ResponseMetadata = {
      RecordsCount: metadata.fetched_records_count,
      Bookmark: metadata.bookmark,
    };
    return JSON.stringify(results);
  }

  // Example: Pagination with Ad hoc Rich Query
  // QueryDocsWithPagination uses a query string, page harvestDate and a bookmark to perform a query
  // for documents. Query string matching state database syntax is passed in and executed as is.
  // The number of fetched records would be equal to or lesser than the specified page harvestDate.
  // Supports ad hoc queries that can be defined at runtime by the client.
  // If this is not desired, follow the QueryDocsForOwner example for parameterized queries.
  // Only available on state databases that support rich query (e.g. CouchDB)
  // Paginated queries are only valid for read only transactions.
  async QueryDocsWithPagination(ctx, queryString, pageharvestDate, bookmark) {

    const { iterator, metadata } = await ctx.stub.getQueryResultWithPagination(queryString, pageharvestDate, bookmark);
    const results = await this.GetAllResults(iterator, false);

    results.ResponseMetadata = {
      RecordsCount: metadata.fetched_records_count,
      Bookmark: metadata.bookmark,
    };

    return JSON.stringify(results);
  }

  // GetDocHistory returns the chain of custody for an document since issuance.
  async GetDocHistory(ctx, documentName) {

    let resultsIterator = await ctx.stub.getHistoryForKey(documentName);
    let results = await this.GetAllResults(resultsIterator, true);

    return JSON.stringify(results);
  }

  // DocExists returns true when document with given ID exists in world state
  async DocExists(ctx, documentName) {
    // ==== Check if document already exists ====
    let documentState = await ctx.stub.getState(documentName);
    return documentState && documentState.length > 0;
  }

  async GetAllResults(iterator, isHistory) {
    let allResults = [];
    let res = await iterator.next();
    while (!res.done) {
      if (res.transcript && res.transcript.transcript.toString()) {
        let jsonRes = {};
        console.log(res.transcript.transcript.toString('utf8'));
        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.transcript.tx_id;
          jsonRes.Timestamp = res.transcript.timestamp;
          try {
            jsonRes.Value = JSON.parse(res.transcript.transcript.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.transcript.transcript.toString('utf8');
          }
        } else {
          jsonRes.Key = res.transcript.key;
          try {
            jsonRes.Record = JSON.parse(res.transcript.transcript.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.transcript.transcript.toString('utf8');
          }
        }
        allResults.push(jsonRes);
      }
      res = await iterator.next();
    }
    iterator.close();
    return allResults;
  }
   
   */
  // InitLedger creates sample documents in the ledger
  async InitLedger(ctx) {
    const documents = [
      {
        docID: '0',
        certificate: 'begin',
        transcript: 'begin',
        owner: 'tester',
        information: {
          name:'test',
          place:'high school'
        }
      },
    ];

    for (const document of documents) {
      await this.CreateDoc(
        ctx,
        document.docID,
        document.certificate,
        document.transcript,
        document.owner,
        document.information,
      );
    }
  }
}

module.exports = Chaincode;
