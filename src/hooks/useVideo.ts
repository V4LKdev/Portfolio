/**
 * useVideo
 *
 * Thin hook to access VideoContext state and actions.
 * Prefer this over importing the context directly.
 */
import { useVideoContext } from "../contexts/VideoContext";

export const useVideo = () => useVideoContext();
