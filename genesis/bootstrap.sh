#!/usr/bin/env bash
geth init ./genesis.json --datadir=./data/
bootnode --genkey=boot.key
bootnode --nodekey=boot.key
#geth --rpc --rpccorsdomain="http://127.0.0.1:3000" --datadir=/root/data/
geth --rpc --rpcport "8545" --rpcaddr "127.0.0.1" --rpccorsdomain "*"  --datadir=./data/ --nat "none" --bootnodes="127.0.0.1"