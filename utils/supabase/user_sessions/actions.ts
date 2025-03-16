"use server";
const { createClientForServer } = require("@/utils/supabase/server");

export async function addUserToSession(sessionId: string, userName: string, userId: string){
  try {
    const supabase = await createClientForServer();
    const { error } = await supabase
      .from("user_sessions")
      .upsert({ user_id: userId, name: userName, session_id: sessionId }, { onConflict: ["user_id", "session_id"] });
    if (error) {
      console.error("Users for session not found or error fetching user_session:", error?.message);
      return [];
    }

    const { data: allUsers, error: allUserError } = await supabase
      .from("user_sessions").select("*").eq("session_id", sessionId);

    if (allUserError) {
      console.error("Users for session not found or error fetching user_session:", error?.message);
      return [];
    }
    return allUsers;
  } catch (error) {
    console.error("Error creating session:", error);
  }
  
}

export async function removeUserFromSession(sessionId: string, userId: string){
  try {
    const supabase = await createClientForServer();
    const { error } = await supabase
      .from("user_sessions")
      .delete()
      .eq('user_id', userId)
      .eq('session_id', sessionId);;
    if (error) {
      console.error("Users for session not found or error fetching user_session:", error?.message);
      return [];
    }
  } catch (error) {
    console.error("Error creating session:", error);
  }
  
}

export async function postVote(sessionId: string, userId: string, point: string){
  try {
    const supabase = await createClientForServer();
    const { error } = await supabase
      .from("user_sessions")
      .update({ point })
      .eq('user_id', userId)
      .eq('session_id', sessionId);
    if (error) {
      console.error("Users for session not found or error fetching user_session:", error?.message);
      return [];
    }
  } catch (error) {
    console.error("Error creating session:", error);
  }
  
}

export async function resetAllVotes(sessionId: string){
  try {
    const supabase = await createClientForServer();
    const { error } = await supabase
      .from("user_sessions")
      .update({ point: null })
      .eq('session_id', sessionId);
    if (error) {
      console.error("Users for session not found or error fetching user_session:", error?.message);
      return [];
    }
  } catch (error) {
    console.error("Error creating session:", error);
  }
  
}