import { useWeb3Contract  } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {

	const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
	const chainId = parseInt(chainIdHex);
	const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
	const [entranceFee, setEntranceFee] = useState("1");
	const [numPlayers, setNumPlayers] = useState("1");
	const [recentWinner, setRecentWinner] = useState("1");
	const dispatch = useNotification();

	const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract ({
		abi : abi,
		contractAddress: raffleAddress,
		functionName: "enterRaffle",
		params: {},
		msgValue: entranceFee,
	});

	const { runContractFunction: getEntranceFee } = useWeb3Contract({
		abi : abi,
		contractAddress: raffleAddress,
		functionName: "getEntranceFee",
		params: {},
	});

	const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
		abi : abi,
		contractAddress: raffleAddress,
		functionName: "getNumberOfPlayers",
		params: {},
	});	
	
	const { runContractFunction: getRecentWinner } = useWeb3Contract({
		abi : abi,
		contractAddress: raffleAddress,
		functionName: "getRecentWinner",
		params: {},
	});

	async function updateUI() {
		const entranceFeeFromCall = (await getEntranceFee()).toString();
		console.log(entranceFeeFromCall)
		const numPlayersFromCall = (await getNumberOfPlayers()).toString();
		const recentWinnerFromCall = await getRecentWinner();
		setEntranceFee(entranceFeeFromCall);
		setNumPlayers(numPlayersFromCall);
		setRecentWinner(recentWinnerFromCall);
	}

	useEffect(() => {
		if (isWeb3Enabled) {

			updateUI();
		}
	}, [isWeb3Enabled]);

	const handleSuccess = async function (tx) {
		console.log(tx);
		await tx.wait(1);
		console.log(tx);
		updateUI();
		handleNewNotification(tx);
	}

	const handleNewNotification = function () {
		dispatch({
			type: "info",
			message: "Transaction Complete!",
			title: "Tx Notification",
			position: "topR",
			icon: "bell"
		})
	}

	return(
	
		<div>
			<br></br>

			{ raffleAddress
				? (<div className="px-4">
						<button 
							
							className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto" 
							onClick = {async function () {
								await enterRaffle({
									onSuccess: (tx) => handleSuccess(tx),
									onError: (error) => console.log(error)
								});
							}}
							disabled = {isLoading || isFetching}

						
						>
						{ (isLoading || isFetching) 
							? <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div> 
							: <div>Enter Raffle</div>
						} 

						</button>

						<div className="py-4">Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
						Number of Players: {numPlayers} 
						<div className="py-4">Recent Winner: {recentWinner}</div>
					</div>)
				: (<div>Connect to a wallet to begin...</div>)
			}

		</div>

	)




}