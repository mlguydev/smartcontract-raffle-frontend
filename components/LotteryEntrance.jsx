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
	const dispatch = useNotification();

	let entranceFeeFromCall;

	const { runContractFunction: enterRaffle } = useWeb3Contract ({
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

	useEffect(() => {
		if (isWeb3Enabled) {
			async function updateUI() {
				if (raffleAddress) 
				{entranceFeeFromCall = (await getEntranceFee()).toString();}
				setEntranceFee(entranceFeeFromCall);
			}
			updateUI();
		}
	}, [isWeb3Enabled]);

	const handleSuccess = async function (tx) {
		await tx.wait(1);
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
			Hi from lottery Entrance! 

			{ raffleAddress
				? (<div>
						<button onClick={async function () {
							await enterRaffle({
								onSuccess: handleSuccess,
								onError: (error) => console.log(error)
							});
						}}>Enter Raffle

						</button>
						Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
					</div>)
				: (<div>No raffle address detected...</div>)
			}

		</div>

	)




}