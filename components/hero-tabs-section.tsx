"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function HeroTabsSection() {
	const [activeTab, setActiveTab] = useState("organize");

	return (
		<section className="border-t bg-white py-16">
			<div className="container mx-auto px-5">
				<div className="mx-auto max-w-6xl">
					{/* Tabs */}
					<div className="flex gap-3 justify-center mb-10">
						<Button
							onClick={() => setActiveTab("organize")}
							className={`rounded-lg px-6 py-3 tex-sm font-medium transition-colors ${activeTab === "organize" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
						>
							Organize Apps
						</Button>
						<Button
							onClick={() => setActiveTab("hired")}
							className={`rounded-lg px-6 py-3 tex-sm font-medium transition-colors ${activeTab === "hired" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
						>
							Get Hired
						</Button>
						<Button
							onClick={() => setActiveTab("boards")}
							className={`rounded-lg px-6 py-3 tex-sm font-medium transition-colors ${activeTab === "boards" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
						>
							Manage Boards
						</Button>
					</div>
					<div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border-gray-200 shadow-xl">
						{activeTab === "organize" && (
							<Image
								src={"/hero-images/hero1.png"}
								alt="Organize apps"
								width={1200}
								height={800}
							></Image>
						)}
						{activeTab === "hired" && (
							<Image
								src={"/hero-images/hero2.png"}
								alt="Get Hired"
								width={1200}
								height={800}
							></Image>
						)}
						{activeTab === "boards" && (
							<Image
								src={"/hero-images/hero3.png"}
								alt="Manage Boards"
								width={1200}
								height={800}
							></Image>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
