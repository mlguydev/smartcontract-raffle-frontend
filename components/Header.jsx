import { ConnectButton } from "web3uikit"

export default function Header() {
	return (
		
		<div>
			Decentralized Raffle by Roman Wiseman
			<br></br>
			<br></br>
			<ConnectButton moralisAuth={false} />
			
		</div>
	)
}