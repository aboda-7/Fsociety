import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import axios from "axios";

const LikeButton = ({ postId, initialLikes, userId }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLikes.includes(userId));

  const handleLike = async () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev.filter(id => id !== userId) : [...prev, userId]));

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:4000/post/likePost/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error liking post:", error);
      // Revert UI in case of an error
      setLiked(!liked);
      setLikes((prev) => (liked ? [...prev, userId] : prev.filter(id => id !== userId)));
    }
  };

  return (
    <button onClick={handleLike}>
      <motion.div
        animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.2 }}
      >
      <Heart color={liked ? "red" : "white"} fill={liked ? "red" : "white"} />
      </motion.div>
      <span>
        {likes.length}
      </span>
    </button>
  );
};

export default LikeButton;
