import { ConnectButton } from "web3uikit"

export default function Header() {
	return (
		
		<div className="p-5 border-b-2 flex flex-row">

			<h1 className="py-4 px-4 font-blog text-3xl">Decentralized Raffle by Roman Wiseman</h1>
			
			<div className="ml-auto py-4 px-4">
				<ConnectButton moralisAuth={false} />
			</div>

		</div>
	)
}