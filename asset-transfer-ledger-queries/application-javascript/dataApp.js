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

const channelName = 'mychannel';
const chaincodeName = 'portfolio';
const mspOrg3 = 'Org3MSP';
const walletPath = path.join(__dirname, 'normal-wallet');
const express = require('express');
const cors = require('cors');
const userId = 'normal';

// const web_url = 'http://localhost:8080'
const web_url = 'http://coffee-trace.cf'
const app = express()
const state = { isShutdown: false };

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

let nowContract = {};
let allGateway = [];

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

app.get("/", (req, res) => {
	res.send("Hello data");
});

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

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
		await registerAndEnrollUser(caClient, wallet, mspOrg3, userId, 'org2.department1');

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

			const loginMiddleWare = (req, res, next) => {
				async function getData() {
					console.log('\n--> Evaluate Transaction: GetAssetsByRange, function use an open start and open end range to return all');
					let result = await contract.evaluateTransaction('ReadAsset', req.body.username).catch((err) => {
						console.log("Timeout or other error: ", err)
						res.send(err)
					});
					result = (prettyJSONString(result.toString()));
					console.log('******************************studentUsers :', result);
					if (result.includes(`"Profile"`)) next();
					else res.send("ไม่พบผู้ใช้นี้ในระบบ");
				}
				getData()
			};
			const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
				console.log(payload);
				async function getData() {
					console.log('\n--> Evaluate Transaction: GetAssetsByRange, function use an open start and open end range to return all');
					let result = await contract.evaluateTransaction('ReadAsset', payload.sub ).catch((err) => {
						console.log("Timeout or other error: ", err)
						done(null, false)
					});
					result = (prettyJSONString(result.toString()));
					console.log('******************************studentUsers :', result);
					if (result.includes(payload.sub)) done(null, true);
					else done(null, false);
				}
				getData()
			});

			//เสียบ Strategy เข้า Passport
			passport.use(jwtAuth);
			//ทำ Passport Middleware
			const requireJWTAuth = passport.authenticate("jwt", { session: false });
			//ทำ Middleware สำหรับขอ JWT


			app.post("/login", loginMiddleWare, (req, res) => {
				const payload = {
					sub: req.body.username,
					iat: new Date().getTime()
				};
				res.send(jwt.encode(payload, SECRET));

			});


			app.get('/api/v1/readData', (req, res) => {
				let curUser = JSON.parse(Buffer.from((req.headers.authorization).
					split(".")[1], 'base64').toString()).sub

				console.log(curUser)
				main(curUser);


				async function getData() {
					console.log('\n--> Evaluate Transaction: GetAssetsByRange, function use an open start and open end range to return all');
					let result = await nowContract.evaluateTransaction('GetAssetsByRange', '', '');
					res.send(prettyJSONString(result.toString()));

				}
				getData()
			})

			app.get('/api/v1/receiveData', (req, res) => {


				async function getData() {
					console.log('\n--> Evaluate Transaction: GetAssetsByRange, function use an open start and open end range to return all');
					let result = await contract.evaluateTransaction('GetAssetsByRange', '', '');
					res.send(prettyJSONString(result.toString()));

				}
				getData()
			})


			app.get('/api/v1/readDatabyOwner', (req, res) => {
				let curUser = JSON.parse(Buffer.from((req.headers.authorization).
					split(".")[1], 'base64').toString()).sub

				main(curUser);


				async function getDataOwner() {
					console.log('\n--> Evaluate Transaction: QueryAssetsByOwner, find all assets with owner(Michel)');
					result = await nowContract.evaluateTransaction('QueryAssetsByOwner');

					res.send(prettyJSONString(result.toString()));

				}
				getDataOwner()
			})


			app.post('/api/v1/createRequest', requireJWTAuth, (req, res) => {
				let curUser = JSON.parse(Buffer.from((req.headers.authorization).
					split(".")[1], 'base64').toString()).sub

				console.log(curUser)
				main(curUser);


				const data = {
					docID: String(req.body.docID),
					category: 'request',
					owner: String(req.body.owner),
					information: {
						transcript: String(req.body.transcript),
						certificate: String(req.body.certificate),
						recordDate: String(req.body.recordDate)
					}
				}

				console.log(data);
				async function createData(data) {
					console.log(data);
					console.log('\n--> Submit Transaction: CreateAsset, creates new asset with lotID, species, harvestDate, and value arguments');
					result = await nowContract.submitTransaction('CreateAsset', data.docID, data.category,  data.owner, JSON.stringify(data.information));
					console.log('*** Result: committed', result);
					res.send(result)
				}

				createData(data)

			})


			app.get('/api/v1/approve/:assetName', (req, res) => {
				const user = {
					// userId: req.headers.authorization,
					assetName: req.params.assetName
				}
				let curUser = JSON.parse(Buffer.from((req.headers.authorization).
					split(".")[1], 'base64').toString()).sub

				console.log(curUser)
				main(curUser);


				async function receiveData(assetName) {
					console.log('\n--> Submit Transaction: TransferAsset, transfer asset(asset2) to new owner(Tom)', assetName);
					await nowContract.submitTransaction('TransferAsset', assetName);
					console.log('*** Result: committed');
					res.send(200);
				}

				receiveData(user.assetName)


			})
			app.get('/api/v1/receive/:assetName', (req, res) => {
				const user = {
					assetName: req.params.assetName
				}
				console.log(user)

				async function readData(assetName) {
					console.log('\n--> Evaluate Transaction: ReadAsset, function returns information about an asset with ID(asset7)');
					result = await contract.evaluateTransaction('ReadAsset', assetName).catch((err) => 
					{
						console.log("Timeout or other error: ", err)
						res.send(err)
					});
					console.log(`*** Result: ${prettyJSONString(result.toString())}`);
					res.send(prettyJSONString(result.toString()));
				}

				readData(user.assetName)


			})
			app.get('/api/v1/getData/:assetName', (req, res) => {
				const user = {
					// userId: req.headers.authorization,
					assetName: req.params.assetName
				}
				let curUser = JSON.parse(Buffer.from((req.headers.authorization).
					split(".")[1], 'base64').toString()).sub

				console.log(curUser)
				main(curUser);


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
