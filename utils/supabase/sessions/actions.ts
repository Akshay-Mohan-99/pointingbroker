"use server";
const { generateRandomString } = require("@/utils/helper/generateRandomString");
const { createClientForServer } = require("@/utils/supabase/server");

export async function createSession(){
  try {
    const supabase = await createClientForServer();
    let randomString = generateRandomString();
    while(true){
      const { data } = await supabase.from("sessions").select("*").eq("session_id", randomString).maybeSingle();
      if(data){
        randomString = generateRandomString();
        continue;
      }
      break;
    }
    const { data: session, error } = await supabase.from("sessions").insert([{session_id: randomString, config: {}}]).select("*").single();
    if (error) console.error("Error creating session:", error);

    return session;
  } catch (error) {
    console.error("Error creating session:", error);
  }
  
}


export async function getSessionBySessionId(sessionId: string){
  try{
    if (!sessionId.trim()) {
      throw Error('Session Id is empty');
    }
    const supabase = await createClientForServer();
    const { data: session, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("session_id", sessionId);

    if (error || !session) {
      console.error("Session not found or error fetching session:", error?.message);
      return;
    }

    return session;
  } catch (error) {
    console.error("Error fetching session:", error);
  }
}


export async function sendSessionAction(sessionId: string, action: string){
  try{
    const supabase = await createClientForServer();
    const { error } = await supabase
      .from("sessions")
      .update({ action })
      .eq('session_id', sessionId);

    if (error) {
      console.error("Session not found or error updating session:", error?.message);
      return;
    }
  } catch (error) {
    console.error("Error fetching session:", error);
  }
}