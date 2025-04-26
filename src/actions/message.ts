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
/**
 * Gets all messages for a user (both sent and received)
 */
export async function getAllMessages(userId: string) {
  try {
    // Build query to get all messages where the user is either sender or receiver
    const query = supabase
      .from("messages")
      .select("*")
      .or(`msg_sender_id.eq.${userId},msg_receiver_id.eq.${userId}`)
      .order("sent_at", { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    console.log("Fetched messages:", data);
    return data || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}
