#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

# clean out any old identites in the wallets
rm -rf javascript/wallet/*
rm -rf java/wallet/*
rm -rf typescript/wallet/*
rm -rf go/wallet/*

# launch network; create channel and join peer to channel
pushd ../test-network
./network.sh down #take time estimate 2 min
./network.sh up -i 2.3.0 -ca -s couchdb
./network.sh createChannel -c channel1 
cd addOrg3
./addOrg3.sh up -c channel1 -ca -s couchdb
cd ..
./network.sh deployCC -ccn portfolio -ccp ../asset-transfer-ledger-queries/chaincode-javascript/ -ccl javascript -c channel1


export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org3MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
export CORE_PEER_ADDRESS=localhost:11051

peer lifecycle chaincode package portfolio.tar.gz --path ../asset-transfer-ledger-queries/chaincode-javascript/ --lang node --label portfolio_1

peer lifecycle chaincode install portfolio.tar.gz

peer lifecycle chaincode queryinstalled
RESULT=`peer lifecycle chaincode queryinstalled`
echo $RESULT
PACKAGEID=`echo "$RESULT" | grep "portfolio_1" |sed -e's/.*portfolio_1:\([0-9a-f]*\).*,.*/\1/'`
echo $PACKAGEID
export CC_PACKAGE_ID=portfolio_1:$PACKAGEID

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --channelID channel1 --name portfolio --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1

peer lifecycle chaincode querycommitted --channelID channel1 --name portfolio --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

# peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C channel1 -n portfolio --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt --peerAddresses localhost:11051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt -c '{"function":"InitLedger","Args":[]}'

echo "start Application Javascript"
cd ../asset-transfer-ledger-queries/application-javascript
npm install
# // NOTE: If you see  kind an error like these:
# /*
# 		2020-08-07T20:23:17.590Z - error: [DiscoveryService]: send[mychannel] - Channel:mychannel received discovery error:access denied
# 		******** FAILED to run the application: Error: DiscoveryService: mychannel error: access denied

# 	 OR

# 	 Failed to register user : Error: fabric-ca request register failed with errors [[ { code: 20, message: 'Authentication failure' } ]]
# 	 ******** FAILED to run the application: Error: Identity not found in wallet: appUser
# */
# // Delete the /fabric-samples/asset-transfer-ledger-queries/application-javascript/wallet directory
# // and retry this application.
rm -rf wallet
node init.js
cat <<EOF
run network for Coffee bean trace
org1 = school
org2 = training center
org3 = data center
EOF