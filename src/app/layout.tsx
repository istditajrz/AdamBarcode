// @ts-expect-error css import
import "@mantine/core/styles.layer.css";
// @ts-expect-error css import
import "./global.css";

import { Source_Sans_3 } from "next/font/google"
import { MantineProvider, mantineHtmlProps } from "@mantine/core";
import { ErrorList } from "@/app/ErrorList";
import type { Metadata } from "next";
import { authenticate } from "@/common/api.mts";

export const metadata: Metadata = {
	title: "RMScanner",
	description: "Barcode companion for AdamRMS",
};

const SS3 = Source_Sans_3();

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	authenticate();
	return (
		<html lang="en" className={SS3.className} {...mantineHtmlProps}>
			<head>
				<meta charSet={"utf-8"} />
				<meta
					name="viewport"
					content="width=device-width, inital-scale=1.0"
				/>
			</head>
			<body className="h-screen w-screen p-8">
				<MantineProvider
					withCssVariables={false}
					withGlobalClasses={false}
				>
					<ErrorList />
					{children}
				</MantineProvider>
				<br />
				<footer>
					<p className="m-auto text-center">
						Find this on{" "}
						<a
							href="https://github.com/istditajrz/"
							target="_blank"
							className="underline text-blue-500"
						>
							GitHub
						</a>
					</p>
					<p className="m-auto text-center">
						With thanks to{" "}
						<a
							href="https://adam-rms.com/"
							className="underline text-blue-500"
						>
							AdamRMS
						</a>
					</p>
				</footer>
			</body>
		</html>
	);
}
