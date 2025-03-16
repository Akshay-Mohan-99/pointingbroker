import PointingPoker from "./Pointingpoker"

export default async function SessionPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>
}>) {
  const { slug: sessionId } = await params;
  return(
    <PointingPoker sessionId={sessionId}/>
  )
}