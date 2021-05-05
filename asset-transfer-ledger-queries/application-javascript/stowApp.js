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
const { buildCCPOrg3, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName = 'channel1';
const chaincodeName = 'coffee';
const mspOrg3 = 'Org3MSP';
const walletPath = path.join(__dirname, 'stow-wallet');
const express = require('express');
const cors = require('cors');
const userId='stow1'

// const web_url = 'http://localhost:8080'
const web_url = 'http://coffee-trace.cf'
const app = express()
const state = { isShutdown: false };
let allGateway = [];
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

// pre-requisites:
// - fabric-sample two organization test-network setup with two peers, ordering service,
//   and 2 certificate authorities, with the state database using couchdb
//         ===> from directory /fabric-samples/test-network
//         ./network.sh up createChannel -ca -s couchdb
// - Use any of the asset-transfer-ledger-queries chaincodes deployed on the channel "mychannel"
//   with the chaincode name of "ledger". The following deploy command will package,
//   install, approve, and commit the javascript chaincode, all the actions it takes
//   to deploy a chaincode to a channel.
//         ===> from directory /fabric-samples/test-network
//         ./network.sh deployCC -ccn ledger -ccp ../asset-transfer-ledger-queries/chaincode-javascript/ -ccl javascript
// - Be sure that node.js is installed
//         ===> from directory /fabric-samples/asset-transfer-ledger-queries/application-javascript
//         node -v
// - npm installed code dependencies
//         ===> from directory /fabric-samples/asset-transfer-ledger-queries/application-javascript
//         npm install
// - to run this test application
//         ===> from directory /fabric-samples/asset-transfer-ledger-queries/application-javascript
//         node app.js

// NOTE: If you see  kind an error like these:
/*
		2020-08-07T20:23:17.590Z - error: [DiscoveryService]: send[mychannel] - Channel:mychannel received discovery error:access denied
		******** FAILED to run the application: Error: DiscoveryService: mychannel error: access denied

	 OR

	 Failed to register user : Error: fabric-ca request register failed with errors [[ { code: 20, message: 'Authentication failure' } ]]
	 ******** FAILED to run the application: Error: Identity not found in wallet: appUser
*/
// Delete the /fabric-samples/asset-transfer-ledger-queries/application-javascript/wallet directory
// and retry this application.
//
// The certificate authority must have been restarted and the saved certificates for the
// admin and application user are not valid. Deleting the wallet store will force these to be reset
// with the new certificate authority.
//

/**
 *  A test application to show ledger queries operations with any of the asset-transfer-ledger-queries chaincodes
 *   -- How to submit a transaction
 *   -- How to query and check the results
 *
 * To see the SDK workings, try setting the logging to show on the console before running
 *        export HFC_LOGGING='{"debug":"console"}'
 */


async function main(userId) {
	console.log('***************************************************get in *********************************************');

	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg3();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org3.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg3);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg3, userId, 'org3.department1');

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
			// console.log('connect gateway : ', userId);

			// Get the contract from the network.
			const contract = (await gateway.getNetwork(channelName)).getContract(chaincodeName);

			allGateway.push({
				userId: userId, gateway: gateway, contract: contract
			})
			// console.log('all gateway : ', allGateway);
			// allGateway.forEach(userId => {
			// 	console.log(userId);
			// })

			// Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
			// This type of transaction would only be run once by an application the first time it was started after it
			// deployed the first time. Any updates to the chaincode deployed later would likely not need to run
			// an "init" type function.
			// if (!skipInit) {
			// 	try {
			// 		console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
			// 		await contract.submitTransaction('InitLedger');
			// 		console.log('*** Result: committed');
			// 	} catch (initError) {
			// 		// this is error is OK if we are rerunning this app without restarting
			// 		console.log(`******** initLedger failed :: ${initError}`)
			// 	}
			// } else {
			// 	console.log('*** not executing "InitLedger');
			// }

			let result;

			// Let's try a query operation (function).
			// This will be sent to just one peer and the results will be shown.
			// console.log('\n--> Evaluate Transaction: GetAssetsByRange, function returns assets in a specific range from asset1 to before asset6');
			// result = await contract.evaluateTransaction('GetAssetsByRange', 'asset1', 'asset6');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// console.log('\n--> Evaluate Transaction: GetAssetsByRange, function use an open start and open end range to return assest1 to asset6');
			// result = await contract.evaluateTransaction('GetAssetsByRange', '', '');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			app.get('/api/v1/readData', requireJWTAuth , (req, res) => {
				let curUser = JSON.parse(Buffer.from((req.headers.authorization).
				split(".")[1], 'base64').toString()).sub
				let nowContract = {};
				console.log(curUser)
				main(curUser);
				console.log('all gateway : ',allGateway);
				allGateway.forEach(gateway => {
					if (gateway.userId == curUser) {
						nowContract = gateway.contract;
						console.log('now', gateway.userId);
					}
				})

				async function getData() {
					console.log('\n--> Evaluate Transaction: GetAssetsByRange, function use an open start and open end range to return all');
					let result = await nowContract.evaluateTransaction('GetAssetsByRange', '', '');
					res.send(prettyJSONString(result.toString()));

				}
				getData()
			})


			app.get('/api/v1/readDatabyOwner', requireJWTAuth , (req, res) => {
				let curUser = JSON.parse(Buffer.from((req.headers.authorization).
				split(".")[1], 'base64').toString()).sub
				let nowContract = {};
				main(curUser);
				console.log('all gateway : ',allGateway);
				allGateway.forEach(gateway => {
					if (gateway.userId == curUser) {
						nowContract = gateway.contract;
						console.log('now', gateway.userId);
					}
				})

				async function getDataOwner() {
					console.log('\n--> Evaluate Transaction: QueryAssetsByOwner, find all assets with owner(Michel)');
					result = await nowContract.evaluateTransaction('QueryAssetsByOwner');

					res.send(prettyJSONString(result.toString()));

				}
				getDataOwner()
			})


			// console.log('\n--> Evaluate Transaction: GetAssetsByRange, function use an fixed start (asset3) and open end range to return assest3 to asset6');
			// result = await contract.evaluateTransaction('GetAssetsByRange', 'asset3', '');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// console.log('\n--> Evaluate Transaction: GetAssetsByRange, function use an open start and fixed end (asset3) range to return assest1 to asset2');
			// result = await contract.evaluateTransaction('GetAssetsByRange', '', 'asset3');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// // Now let's try to submit a transaction.
			// // This will be sent to both peers and if both peers endorse the transaction, the endorsed proposal will be sent
			// // to the orderer to be committed by each of the peer's to the channel ledger.
			// console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID(asset7), color(yellow), size(5), owner(Tom), and appraisedValue(1300) arguments');
			// await contract.submitTransaction('CreateAsset', 'asset7', 'yellow', '5', 'Tom', '1300');
			// console.log('*** Result: committed');


			app.post('/api/v1/createData', requireJWTAuth , (req, res) => {
				let curUser = JSON.parse(Buffer.from((req.headers.authorization).
				split(".")[1], 'base64').toString()).sub
				let nowContract = {};
				console.log(curUser)
				main(curUser);
				console.log('all gateway : ',allGateway);
				allGateway.forEach(gateway => {
					if (gateway.userId == curUser) {
						nowContract = gateway.contract;
						console.log('now', gateway.userId);
					}
				})

				const data = {
					lotID: String(req.body.lotID),
					species: String(req.body.species),
					value: String(req.body.value),
					other: {
						stowUser:curUser,
    				grade:req.body.grade,
						roast_Date:req.body.roast_Date,
						roastExp:req.body.roastExp,
						roast_lv:req.body.roast_lv,
						infoData:req.body
					}
				}
				console.log(data);
				console.log(req.headers.authorization);
				async function createData(assetName,data) {
					console.log('\n--> Evaluate Transaction: ReadAsset, function returns information about an asset with ID(asset7)');
					result = await nowContract.evaluateTransaction('ReadAsset', assetName);
					console.log(`*** Result: ${prettyJSONString(result.toString())}`);
					const latlng = JSON.parse(prettyJSONString(result.toString())).species;
					console.log(latlng);
					data.other = {
						...data.other,
						locationStow : latlng
					}
					console.log(data);
					console.log('\n--> Submit Transaction: CreateAsset, creates new asset with lotID, species, harvestDate, and value arguments');
					result = await nowContract.submitTransaction('CreateAsset', data.lotID, data.species, data.value, JSON.stringify(data.other));
					console.log('*** Result: committed', result);
					res.send(result)
				}

				createData(curUser,data)

			})
			app.get('/api/v1/receiveData/:assetName', requireJWTAuth , (req, res) => {
				const user = {
					// userId: req.headers.authorization,
					assetName: req.params.assetName
				}
				let curUser = JSON.parse(Buffer.from((req.headers.authorization).
				split(".")[1], 'base64').toString()).sub
				let nowContract = {};
				console.log(curUser)
				main(curUser);
				console.log('all gateway : ',allGateway);
				allGateway.forEach(gateway => {
					if (gateway.userId == curUser) {
						nowContract = gateway.contract;
						console.log('now', gateway.userId);
					}
				})

				async function readData(assetName) {
					console.log('\n--> Evaluate Transaction: ReadAsset, function returns information about an asset with ID(asset7)');
					result = await nowContract.evaluateTransaction('ReadAsset', assetName);
					console.log(`*** Result: ${prettyJSONString(result.toString())}`);
					res.send(result)
					// res.redirect(307, web_url+'/stow2?id=' + assetName);
				}

						readData(user.assetName)

			})
			app.get('/api/v1/receiveData/:assetName/1', requireJWTAuth, (req, res) => {
				const user = {
					// userId: req.headers.authorization,
					assetName: req.params.assetName
				}
				let curUser = JSON.parse(Buffer.from((req.headers.authorization).
				split(".")[1], 'base64').toString()).sub
				let nowContract = {};
				console.log(curUser)
				main(curUser);
				console.log('all gateway : ',allGateway);
				allGateway.forEach(gateway => {
					if (gateway.userId == curUser) {
						nowContract = gateway.contract;
						console.log('now', gateway.userId);
					}
				})

				async function receiveData(assetName) {
					console.log('\n--> Submit Transaction: TransferAsset, transfer asset(asset2) to new owner(Tom)', assetName);
					await nowContract.submitTransaction('TransferAsset', assetName);
					console.log('*** Result: committed');
					res.send(200);
				}
				
				receiveData(user.assetName)


			})
			app.get('/api/v1/buyerReceiveData/:assetName', (req, res) => {
				const user = {
					// userId: req.headers.authorization,
					assetName: req.params.assetName
				}
				// let curUser = user.userId
				console.log(user)
				// main(curUser);


				async function readData(assetName) {
					console.log('\n--> Evaluate Transaction: ReadAsset, function returns information about an asset with ID(asset7)');
					result = await contract.evaluateTransaction('ReadAsset', assetName);
					console.log(`*** Result: ${prettyJSONString(result.toString())}`);
					res.send(result);
					// res.location(307, web_url+'/show?id=' + assetName);
				}

						readData(user.assetName)
					

			})
			app.get('/api/v1/getData/:assetName', requireJWTAuth, (req, res) => {
				const user = {
					// userId: req.headers.authorization,
					assetName: req.params.assetName
				}
				let curUser = JSON.parse(Buffer.from((req.headers.authorization).
				split(".")[1], 'base64').toString()).sub
				let nowContract = {};
				console.log(curUser)
				main(curUser);
				console.log('all gateway : ',allGateway);
				allGateway.forEach(gateway => {
					if (gateway.userId == curUser) {
						nowContract = gateway.contract;
						console.log('now', gateway.userId);
					}
				})

				async function readData(assetName) {
					console.log('\n--> Evaluate Transaction: ReadAsset, function returns information about an asset with ID(asset7)');
					result = await nowContract.evaluateTransaction('ReadAsset', assetName);
					console.log(`*** Result: ${prettyJSONString(result.toString())}`);
					res.send(result)
				}


				readData(user.assetName)

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

main(userId);


const port = process.env.PORT || 5000

let server = app.listen(port, function () {
	console.log(`Example app listening on ${port}`)
})

const bodyParser = require("body-parser");
app.use(bodyParser.json());
const jwt = require("jwt-simple");
const passport = require("passport");
//ใช้ในการ decode jwt ออกมา
const ExtractJwt = require("passport-jwt").ExtractJwt;
//ใช้ในการประกาศ Strategy
const JwtStrategy = require("passport-jwt").Strategy;
const SECRET = "MY_SECRET_KEY";
//สร้าง Strategy
const jwtOptions = {
	 jwtFromRequest: ExtractJwt.fromHeader("authorization"),
	 secretOrKey: SECRET
};
const stowUsers = ["stow1"];
const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
	 if (stowUsers.includes(payload.sub)) done(null, true);
	 else done(null, false);
});
//เสียบ Strategy เข้า Passport
passport.use(jwtAuth);
//ทำ Passport Middleware
const requireJWTAuth = passport.authenticate("jwt",{session:false});
//เสียบ middleware ยืนยันตัวตน JWT เข้าไป
app.get("/", requireJWTAuth, (req, res) => {
	res.send('oh my');
});
//ทำ Middleware สำหรับขอ JWT
const loginMiddleWare = (req, res, next) => {
	 if (stowUsers.includes(req.body.username)) next();
	 else res.send("Wrong username");
};
app.post("/login", loginMiddleWare, (req, res) => {
	 const payload = {
			sub: req.body.username,
			iat: new Date().getTime()
	 };
	 res.send(jwt.encode(payload, SECRET));
});