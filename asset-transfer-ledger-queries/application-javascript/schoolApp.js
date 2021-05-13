/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');
const category = ['transcript', 'certificate'];
const channelName = 'mychannel';
const chaincodeName = 'portfolio';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const express = require('express');
const cors = require('cors');
const app = express()
const state = { isShutdown: false };
let allGateway = [];
let nowContract = {};

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});
const CLIENT_ID =
	"624928619172-6cq2g8hagvcaa5cmrql2jegiqe9ref1q.apps.googleusercontent.com"
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
async function verify(token) {
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
		// Or, if multiple clients access the backend:
		//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
	});
	const payload = ticket.getPayload();
	// console.log(payload['sub'],payload['email']);
	return payload['email']

}
// verify(curUser).catch(console.error);
app.get("/", (req, res) => {
	res.send("Hello school");
});


function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main(userId) {
	console.log('***************************************************get in *********************************************');

	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, userId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		// if(UserId==userId)
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: userId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			console.log('connect gateway : ', userId);

			// Get the contract from the network.
			const contract = (await gateway.getNetwork(channelName)).getContract(chaincodeName);

			allGateway.push({
				userId: userId, gateway: gateway, contract: contract
			})
			console.log('all gateway : ', allGateway);
			allGateway.forEach(userId => {
				console.log(userId.userId);
			})
			allGateway.forEach(gateway => {
				if (gateway.userId == userId) {
					nowContract = gateway.contract;
					console.log('now', gateway.userId);
				}
			})

			let result;



			app.get('/api/v1/readData', (req, res) => {
				let curUser = (req.headers.authorization)
				verify(curUser).then(email => {
					console.log(email);
					main(email);
					console.log(allGateway);
				})

				async function getData() {
					console.log('\n--> Evaluate Transaction: GetAssetsByRange, function use an open start and open end range to return all');
					let result = await contract.evaluateTransaction('GetAssetsByRange', '', '');
					res.send(prettyJSONString(result.toString()));

				}
				getData()
			})




			app.get('/api/v1/readDatabyOwner', (req, res) => {
				console.log('read Data');
				let curUser = (req.headers.authorization)
				try {
					curUser = verify(curUser)
				} catch (error) {
					res.send(404)
				}
				let nowContract = {};
				main(curUser);
				console.log('all gateway : ', curUser);
				allGateway.forEach(gateway => {
					if (gateway.userId == curUser) {
						nowContract = gateway.contract;
						console.log('now', gateway.userId);
					}
				})

				async function getDataOwner() {

					console.log('\n--> Evaluate Transaction: QueryAssetsByOwner, find all assets with owner', curUser);
					result = await nowContract.evaluateTransaction('QueryAssetsByOwner');

					res.send(prettyJSONString(result.toString()));

				}
				getDataOwner()
			})


			app.get('/api/v1/readData/:assetName', (req, res) => {
				console.log('read data ');
				let token = (req.headers.authorization)
				const user = {
					assetName: req.params.assetName
				}

				async function readData(assetName) {
					console.log('\n--> Evaluate Transaction: ReadAsset, function returns information about an asset with ID ', assetName);
					result = await contract.evaluateTransaction('ReadAsset', assetName)
						.catch((err) => {
							console.log("Timeout or other error: ", err)
							res.send(err)
						});
					console.log(`*** Result: ${prettyJSONString(result.toString())}`);
					res.send(prettyJSONString(result.toString()));
				}

				readData(user.assetName)


			})
			app.get('/api/v1/approve/:assetName', (req, res) => {
				const user = {
					assetName: req.params.assetName
				}
				let curUser = (req.headers.authorization)
				verify(curUser).then(email => {
					console.log(email);
					main(email);
					console.log(allGateway);
				})


				async function receiveData(assetName) {
					console.log('\n--> Submit Transaction: TransferAsset, transfer asset(asset2) to new owner(Tom)', assetName);
					await nowContract.submitTransaction('TransferAsset', assetName);
					console.log('*** Result: committed');
					
					res.send(200);
				}

				receiveData(user.assetName)


			})

			app.post('/api/v1/createReport', (req, res) => {

				let curUser = (req.headers.authorization)
				verify(curUser).then(email => {
					console.log(email);
					main(email);
					console.log(allGateway);
				})

				const data = {
					docID: String(req.body.docID),
					category: category[0],
					owner: String(req.body.owner),
					information: {
						recordDate: String(req.body.recordDate),
						semester: String(req.body.semester),
						year: String(req.body.year),
						studyReports: String(req.body.studyReports)
					}
				}
				console.log('test', data.studyReports);
				async function createData(data) {
					console.log('\n--> Submit Transaction: CreateAsset, creates new asset with lotID, species, harvestDate, and value arguments');
					result = await nowContract.submitTransaction('CreateAsset', data.docID, data.category, data.owner, JSON.stringify(data.information));
					console.log('*** Result: committed', result);
					res.send(result)
				}

				createData(data)

			})
			app.post('/api/v1/addStudent', (req, res) => {
				let curUser = (req.headers.authorization)
				verify(curUser).then(email => {
					console.log(email);
					main(email);
					console.log(allGateway);
})

					const data = {
						docID: String(req.body.docID),
						category: 'Profile',
						owner: String(req.body.owner),
						information: {
							title: String(req.body.title),
							name: String(req.body.name),
							admissionDate: (req.body.admissionDate),
							birthDate: (req.body.birthDate)
						}
					}

					async function createData(data) {

						console.log('\n--> Submit Transaction: CreateAsset, creates new asset with lotID, species, harvestDate, and value arguments');
						result = await nowContract.submitTransaction('CreateAsset', data.docID, data.category, data.owner, JSON.stringify(data.information));
						console.log('*** Result: committed', result);
						res.send(result)
					}


					createData(data)
				



			})

			console.log('*** ok ok');


			const gracefulShutdown = () => {
				state.isShutdown = true
				console.info('Got SIGTERM. Graceful shutdown start', new Date().toISOString())
				server.close(() => {
					console.log('Closed out remaining connections.')
					gateway.disconnect();
					console.log('Closed all gateway : ', gateway)
					process.exit()
				})
				setTimeout(() => {
					console.error('Could not close connections in time, forcefully shutting down')
					process.exit()
				}, 10 * 1000)
			}


			// listen for TERM signal .e.g. kill
			process.on('SIGTERM', gracefulShutdown)
			// listen for INT signal e.g. Ctrl-C
			process.on('SIGINT', gracefulShutdown)
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			// gateway.disconnect();
		}

	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}

	console.log('*** application ending');

}

main("teacher1");


const port = process.env.PORT || 3000
let server = app.listen(port, function () {
	console.log(`Example app listening on ${port}`)
})