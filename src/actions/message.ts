import { supabase } from "../lib/supabase";
//create a new message
// Create a new message
/**
 * Creates a new message in the database
 */
export async function createMessage(
  message_receiver_id: string,
  message_sender_id: string,
  message_content: string,
  projectId?: number | null
) {
  try {
    // Validate inputs
    if (!message_receiver_id || !message_sender_id || !message_content) {
      throw new Error("Missing required fields for message creation");
    }

    // Create the message object according to your Message type
    const newMessage = {
      msg_sender_id: message_sender_id,
      msg_receiver_id: message_receiver_id,
      project_id: projectId || null, // Handle both project messages and direct messages
      msg_content: message_content,
      sent_at: new Date().toISOString(),
      is_read: false
    };

    // Insert the message into the messages table in Supabase
    const { data, error } = await supabase
      .from("messages")
      .insert(newMessage)
      .select(); // Return the inserted row

    if (error) {
      throw new Error(`Failed to create message: ${error.message}`);
    }

    // Return the created message or null if no data is returned
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
}

/**
 * Gets all messages between a specific sender and receiver
 */
export async function getAllMessages(
  message_sender_id: string,
  message_receiver_id: string,
  projectId?: number | null
) {
  try {
    let query = supabase
      .from("messages")
      .select("*")
      .or(
        `and(msg_sender_id.eq.${message_sender_id},msg_receiver_id.eq.${message_receiver_id}),and(msg_sender_id.eq.${message_receiver_id},msg_receiver_id.eq.${message_sender_id})`
      )
      .order("sent_at", { ascending: true });

    // Add project filter if specified
    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}
