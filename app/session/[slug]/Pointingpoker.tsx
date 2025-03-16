"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button, Container, Grid, Paper, Stack, Text, TextInput, Title } from "@mantine/core";
import { getSessionBySessionId, sendSessionAction } from "@/utils/supabase/sessions/actions";
import { addUserToSession, postVote, resetAllVotes } from "@/utils/supabase/user_sessions/actions";
import { useRouter } from "next/navigation";
import useTempUserSession from "@/utils/helper/useTempUserSession";
import { subscribeToSession, subscribeToSessionState } from "@/utils/supabase/user_sessions/subscribeToChannel";
import { RealtimeChannel } from "@supabase/supabase-js";

const cards = ["1", "2", "3", "5", "8", "13"];

export default function PointingPoker({
  sessionId
}: Readonly<{
  sessionId: string
}>) {
  const router = useRouter();
  const [selected, setSelected] = useState<null | string | number>(null);
  const [show, setShow] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [sessionData, setSessionData] = useState({});
  const [pointData, setPointData] = useState<Record<string,any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const channelRef = useRef<RealtimeChannel | undefined>(undefined);
  const sessionRef = useRef<RealtimeChannel | undefined>(undefined);
  const userSessionId = useTempUserSession();

  useEffect(() => {
    async function setCurrentSession() {
      const currentSession = await getSessionBySessionId(sessionId);
      if(!currentSession){
        return router.push(`/`);
      }
      setSessionData(currentSession);
    }
    setCurrentSession();
  }, []);

  const updatePointScore = (payload: any) => {
    setPointData(prev => ({
      ...prev,
      [payload.user_id]: payload
    }))
  }

  const updateSessionState = (payload: string) => {
    if(payload === 'show')
      return setShow(true);
    setShow(false);
    setSelected(null);
  }

  const joinSession = async () => {
    setIsLoading(true);
    channelRef.current = subscribeToSession(sessionId, updatePointScore);
    sessionRef.current = subscribeToSessionState(sessionId, updateSessionState);
    const allUserData = await addUserToSession(sessionId, userName, userSessionId);
    const allUserMapper = allUserData.reduce((acc: Record<string,any>, user: any) => {
      acc[user.user_id] = user;
      return acc;
    }, {})
    setPointData(allUserMapper);
    setIsLoading(false);
  }

  const handleVote = (value: string) => {
    setSelected(value);
    postVote(sessionId, userSessionId, value);
  };

  const resetVote = () => {
    sendSessionAction(sessionId, 'hide');
    resetAllVotes(sessionId);
  };

  const showVote = () => {
    sendSessionAction(sessionId, 'show');
  };

  return (
    <Container size="lg" py="xl">
        <Title order={1} className=" text-center" mb="lg">
          Happy Pointing
        </Title>

        { channelRef.current ? (
          <>
            <Grid gutter="md">
              {cards.map((card) => (
                <Grid.Col span={{ base: 4, sm: 3, md: 2 }} key={card}>
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Paper
                      withBorder
                      shadow="md"
                      p="lg"
                      radius="md"
                      onClick={() => handleVote(card)}
                      style={{
                        cursor: "pointer",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        transition: "all 0.2s ease-in-out",
                        backgroundColor: selected === card ? "#228be6" : "white",
                        color: selected === card ? "white" : "#333",
                        borderColor: selected === card ? "#228be6" : "#ccc",
                      }}
                      className="hover:bg-blue-200"
                    >
                      {card}
                    </Paper>
                  </motion.div>
                </Grid.Col>
              ))}
            </Grid>

            <Button
              color="red"
              fullWidth
              size="md"
              mt="lg"
              onClick={resetVote}
            >
              Reset Votes
            </Button>
            <Button
              color="green"
              fullWidth
              size="md"
              mt="lg"
              onClick={showVote}
            >
              Show Votes
            </Button>

            <Stack className="text-gray-900 mt-7">
              {Object.keys(pointData).map((userId: string) => (
                <Paper 
                  key={userId} 
                  shadow="xs" 
                  p="md" 
                  radius="md"
                  style={{
                    display: "flex",
                    justifyContent: "space-between", // Keeps both sections aligned
                    alignItems: "center",
                    minWidth: "250px", // Ensures consistency in layout
                  }}
                >
                  {/* Name Section */}
                  <Text style={{ fontWeight: "bold", whiteSpace: "nowrap" }} size="lg">
                    {userId === userSessionId ? 'You' : pointData[userId].name}:
                  </Text>
                
                  {/* Point Section */}
                  <Paper
                    shadow="xs"
                    p="sm"
                    radius="md"
                    style={{ 
                      backgroundColor: show ? "transparent" : pointData[userId].point ? "#a3e635" : "#e63553",
                      minWidth: "50px",  // Ensures all boxes are uniform in width
                      textAlign: "center",
                      transition: "all 0.3s ease-in-out"
                    }}
                  >
                    <Text size="lg" className="font-bold">
                      {show ? pointData[userId].point : ''}
                    </Text>
                  </Paper>
                </Paper>
              
              ))}
            </Stack>
          </>
        ) : (
          <Stack gap="lg" align="start">
            <TextInput
              placeholder="Enter Session ID"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              size="md"
              radius="md"
              className="w-64"
            />
            <Button loading={isLoading} size="md" color="green" onClick={joinSession}>
              Join Session
            </Button>
          </Stack>
        ) }
    </Container>
  );
}
