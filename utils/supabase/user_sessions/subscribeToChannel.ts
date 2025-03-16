import { createClient } from "../client";


export function subscribeToSession(sessionId: string, sendPayload: (payload: any) => void){
  try{
    if (!sessionId.trim()) {
      throw Error('Session Id is empty');
    }
    const supabase = createClient();
    const channel = supabase.channel(`${sessionId}-channel`);
    channel.on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'user_sessions',
      filter: `session_id=eq.${sessionId}`
    }, (payload: any) => {
      sendPayload(payload.new);
    }).subscribe((status: string) => {
      if(status !== 'subscribe')
        return;
      console.log('Connection Established');
    })
    return channel;
  } catch (error) {
    console.error("Error fetching session:", error);
  }
}

export function subscribeToSessionState(sessionId: string, sendPayload: (payload: any) => void){
  try{
    if (!sessionId.trim()) {
      throw Error('Session Id is empty');
    }
    const supabase = createClient();
    const channel = supabase.channel(`${sessionId}-state-channel`);
    channel.on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'sessions',
      filter: `session_id=eq.${sessionId}`
    }, (payload: any) => {
      sendPayload(payload.new.action);
    }).subscribe((status: string) => {
      if(status !== 'subscribe')
        return;
      console.log('Connection Established to state');
    })
    return channel;
  } catch (error) {
    console.error("Error fetching session:", error);
  }
}