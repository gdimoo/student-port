'use strict';

const {Contract} = require('fabric-contract-api');

class Chaincode extends Contract {

	async CreateAsset(ctx, docID, category, owner, information) {
		const exists = await this.AssetExists(ctx, docID);
		if (exists) {
			throw new Error(`The asset ${docID} already exists`);
		}

		let asset = {
			docType: 'document',
			docID: docID,
			category: category,
			creator: ctx.clientIdentity.getID(),
			owner: owner,
			information: information
		};


		await ctx.stub.putState(docID, Buffer.from(JSON.stringify(asset)));
		let indexName = 'category~name';
		let categoryNameIndexKey = await ctx.stub.createCompositeKey(indexName, [asset.category, asset.docID]);

		await ctx.stub.putState(categoryNameIndexKey, Buffer.from('\u0000'));
	}

	async ReadAsset(ctx, id) {
		const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
		if (!assetJSON || assetJSON.length === 0) {
			throw new Error(`Asset ${id} does not exist`);
		}

		return assetJSON.toString();
	}

	async TransferAsset(ctx, assetName) {

		let assetAsBytes = await ctx.stub.getState(assetName);
		if (!assetAsBytes || !assetAsBytes.toString()) {
			throw new Error(`Asset ${assetName} does not exist`);
		}
		let assetToTransfer = {};
		try {
			assetToTransfer = JSON.parse(assetAsBytes.toString()); //unmarshal
		} catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + assetName;
			throw new Error(jsonResp);
		}
		assetToTransfer.creator = ctx.clientIdentity.getID(); //change the owner

		let assetJSONasBytes = Buffer.from(JSON.stringify(assetToTransfer));
		await ctx.stub.putState(assetName, assetJSONasBytes); //rewrite the asset
	}

	async GetAssetsByRange(ctx, startKey, endKey) {

		let resultsIterator = await ctx.stub.getStateByRange(startKey, endKey);
		let results = await this.GetAllResults(resultsIterator, false);

		return JSON.stringify(results);
	}

	async AssetExists(ctx, assetName) {
		// ==== Check if asset already exists ====
		let assetState = await ctx.stub.getState(assetName);
		return assetState && assetState.length > 0;
	}

	async GetAllResults(iterator, isHistory) {
		let allResults = [];
		let res = await iterator.next();
		while (!res.done) {
			if (res.value && res.value.value.toString()) {
				let jsonRes = {};
				console.log(res.value.value.toString('utf8'));
				if (isHistory && isHistory === true) {
					jsonRes.TxId = res.value.tx_id;
					jsonRes.Timestamp = res.value.timestamp;
					try {
						jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Value = res.value.value.toString('utf8');
					}
				} else {
					jsonRes.Key = res.value.key;
					try {
						jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Record = res.value.value.toString('utf8');
					}
				}
				allResults.push(jsonRes);
			}
			res = await iterator.next();
		}
		iterator.close();
		return allResults;
	}

	// InitLedger creates sample assets in the ledger
	async InitLedger(ctx) {
		const assets = [
			{
				docID: '1',
				category: 'init',
				owner: 'Tom',
				information: 100
			},
			{
				docID: '2',
				category: 'init',
				owner: 'Brad',
				information: 100
			},
			{
				docID: '3',
				category: 'init',
				owner: 'Jin Soo',
				information: 200
			},
		];

		for (const asset of assets) {
			await this.CreateAsset(
				ctx,
				asset.docID,
				asset.category,
				asset.owner,
				asset.information
			);
		}
	}
}

module.exports = Chaincode;
