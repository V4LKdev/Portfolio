import React, { useCallback, useEffect, useRef, useState } from "react";
import { useVideo } from "../../hooks/useVideo";
import { videoConfig } from "../../content";

type Props = {
	className?: string;
};

const LocalVideoBackground: React.FC<Props> = ({ className }) => {
		const { videoEnabled, isPausedByVisibility, isPausedByUI, lastVideoTime } = useVideo();
	const videoRef = useRef<HTMLVideoElement | null>(null);
		const [videoError, setVideoError] = useState(false);

	// Helper to safely seek once metadata is available
		const seekToLast = useCallback((el: HTMLVideoElement) => {
		if (!lastVideoTime.current) return;
		const target = lastVideoTime.current;
		const duration = el.duration || Number.POSITIVE_INFINITY;
		// Avoid seeking past the end which can throw in some browsers
		const safeTime = Math.min(target, Math.max(0, duration - 0.05));
		try {
			if (!Number.isNaN(safeTime) && Number.isFinite(safeTime) && safeTime > 0) {
				el.currentTime = safeTime;
			}
		} catch {
			// ignore seek errors
		}
		}, [lastVideoTime]);

		// Play/pause and manage saving/restoring playback time
	useEffect(() => {
		const el = videoRef.current;
		if (!el) return;

		const visibilityOk = !isPausedByVisibility;
		const uiOk = !isPausedByUI;
		const shouldPlay = videoEnabled && visibilityOk && uiOk && !videoError;

		const onLoadedMetadata = () => {
			if (!shouldPlay) return;
			seekToLast(el);
			el.play().catch(() => {});
		};

			if (shouldPlay) {
			if (el.readyState >= 1) {
				// HAVE_METADATA
				seekToLast(el);
				el.play().catch(() => {});
			} else {
				el.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
			}
		} else {
			// Save current time before pausing
			try {
				if (!Number.isNaN(el.currentTime)) {
					lastVideoTime.current = el.currentTime;
				}
			} catch {
				/* noop */
			}
			el.pause();
		}

		return () => {
			el.removeEventListener("loadedmetadata", onLoadedMetadata);
		};
			}, [videoEnabled, isPausedByVisibility, isPausedByUI, lastVideoTime, videoError, seekToLast]);

		// Handle error/canplay transitions gracefully
		useEffect(() => {
			const el = videoRef.current;
			if (!el) return;
			const onError = () => setVideoError(true);
			const onCanPlay = () => setVideoError(false);
			el.addEventListener("error", onError);
			el.addEventListener("canplay", onCanPlay);
			return () => {
				el.removeEventListener("error", onError);
				el.removeEventListener("canplay", onCanPlay);
			};
		}, []);

	return (
			<div className={`absolute inset-0 w-full h-full ${className ?? ""}`} aria-hidden>
			{/* Keep video mounted at all times to preserve decode state and currentTime */}
			<video
				ref={videoRef}
				className="absolute inset-0 w-full h-full object-cover"
				src={videoConfig.localVideoSrc}
				muted
				loop
				playsInline
				poster={videoConfig.posterSrc}
				autoPlay
					preload="metadata"
				disablePictureInPicture
			/>
				{/* Fallback poster overlay with fade */}
						<img
					src={videoConfig.posterSrc}
					alt="Background"
							decoding="async"
							className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${
						!videoEnabled || videoError ? "opacity-100" : "opacity-0"
					}`}
				/>
		</div>
	);
};

export default LocalVideoBackground;
