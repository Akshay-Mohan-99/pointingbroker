"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { Button, TextInput, Title, Container, Stack, Center, Loader } from "@mantine/core";
import { createSession, getSessionBySessionId } from "@/utils/supabase/sessions/actions";

export default function LandingPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateSession = async () => {
    setIsLoading(true);
    const session = await createSession();
    if(session)
      router.push(`/session/${session.session_id}`);
    setIsLoading(false);
  };

  const joinSession = async () => {
    setIsLoading(true);
    const session = await getSessionBySessionId(sessionId);
    if(session)
      router.push(`/session/${sessionId}`);
    setIsLoading(false);
  };

  return (
    <Container size="xs" className="mt-10">
      <Stack gap="lg" align="start">
        <Title order={3} className="text-gray-200">
          Session Management
        </Title>

        { isLoading ? (
            <Loader color="blue" />
          ): (
            <>
              <Button loading={isLoading} size="lg" color="blue" onClick={handleCreateSession}>
                Create New Session
              </Button>

              <Center className="flex space-x-2">
                <TextInput
                  placeholder="Enter Session ID"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  size="md"
                  radius="md"
                  className="w-64"
                />
                <Button loading={isLoading} size="md" color="green" onClick={joinSession}>
                  Join Session
                </Button>
              </Center>
            </>
          )
        }
      </Stack>
    </Container>
  );
}