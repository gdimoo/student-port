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

const channelName = 'channel1';
const chaincodeName = 'coffee';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const express = require('express');
const cors = require('cors');
const app = express()
const state = { isShutdown: false };
let allGateway = [];
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

let time = 0;

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
			// console.log('all gateway : ',allGateway);
			allGateway.forEach(userId => {
				console.log(userId.userId);
			})

			let result;


			app.get('/api/v1/readData', requireJWTAuth,(req, res) => {
				let curUser = JSON.parse(Buffer.from((req.headers.authorization).
				split(".")[1], 'base64').toString()).sub
				console.log(curUser)
				// main(curUser);

				async function getData() {
					console.log('\n--> Evaluate Transaction: GetAssetsByRange, function use an open start and open end range to return all');
					let result = await contract.evaluateTransaction('GetAssetsByRange', '', '');
					res.send(prettyJSONString(result.toString()));

				}
				getData()
			})


			app.get('/api/v1/readDatabyOwner', requireJWTAuth , (req, res) => {
				console.log('read Data');
				let curUser = JSON.parse(Buffer.from((req.headers.authorization).
				split(".")[1], 'base64').toString()).sub
				let nowContract = {};
				main(curUser);
				console.log('all gateway : ',curUser);
				allGateway.forEach(gateway => {
					if (gateway.userId == curUser) {
						nowContract = gateway.contract;
						console.log('now', gateway.userId);
					}
				})

				async function getDataOwner() {

					console.log('\n--> Evaluate Transaction: QueryAssetsByOwner, find all assets with owner',curUser);
					result = await nowContract.evaluateTransaction('QueryAssetsByOwner');

					res.send(prettyJSONString(result.toString()));

				}
				getDataOwner()
			})

			app.get('/api/v1/readData/:assetName', requireJWTAuth , (req, res) => {
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
					res.send(prettyJSONString(result.toString()));
					
				}

						readData(user.assetName)
					

			})

			app.post('/api/v1/createData',requireJWTAuth, (req, res) => {
				
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
						farm: {
							harvestDate: String(req.body.harvestDate),
							fertilizer: String(req.body.fertilizer),
							method: String(req.body.method),
							farmer: curUser
						}
					}
				}
				async function createData(assetName,data) {
					console.log('\n--> Evaluate Transaction: ReadAsset, function returns information about an asset with ID(asset7)');
					result = await nowContract.evaluateTransaction('ReadAsset', assetName);
					console.log(`*** Result: ${prettyJSONString(result.toString())}`);
					const latlng = JSON.parse(prettyJSONString(result.toString())).species;
					console.log(latlng);
					data.other.farm = {
						...data.other.farm,
						locationFarm : latlng
					}
					console.log(data);
					console.log('\n--> Submit Transaction: CreateAsset, creates new asset with lotID, species, harvestDate, and value arguments');
					result = await nowContract.submitTransaction('CreateAsset', data.lotID, data.species, data.value, JSON.stringify(data.other));
					console.log('*** Result: committed', result);
					res.send(result)
				}

				createData(curUser,data)

			})

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
			 gateway.disconnect();
		}

	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}

	console.log('*** application ending');

}
	main("farmer1");

	
	const port = process.env.PORT || 3000
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
	const farmerUsers = ["farmer1","farmer2"];
	const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
		console.log(payload);
		 if (farmerUsers.includes(payload.sub)) done(null, true);
		 else done(null, false);
	});
	//เสียบ Strategy เข้า Passport
	passport.use(jwtAuth);
	//ทำ Passport Middleware
	const requireJWTAuth = passport.authenticate("jwt",{session:false});
	//ทำ Middleware สำหรับขอ JWT
	const loginMiddleWare = (req, res, next) => {
		 if (farmerUsers.includes(req.body.username)) next();
		 else res.send("Wrong username");
	};
	app.post("/login", loginMiddleWare, (req, res) => {
		 const payload = {
				sub: req.body.username,
				iat: new Date().getTime()
		 };
		 res.send(jwt.encode(payload, SECRET));
	});