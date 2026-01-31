import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../../constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

interface AudioPlayerProps {
  uri: string;
  duration?: number;
  isUser?: boolean;
}

export default function AudioPlayer({ uri, duration, isUser = false }: AudioPlayerProps) {
  // Common State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);

  // Mobile State
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Web State
  const webAudioRef = useRef<HTMLAudioElement | null>(null);

  // Generate random waveform bars once
  const bars = useMemo(() => {
    return Array.from({ length: 20 }, () => Math.max(0.3, Math.random()));
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (webAudioRef.current) {
        webAudioRef.current.pause();
        webAudioRef.current = null;
      }
    };
  }, [sound]);

  const handlePlayPause = async () => {
    // --- WEB LOGIC ---
    if (Platform.OS === 'web') {
      if (!webAudioRef.current) {
        webAudioRef.current = new window.Audio(uri);
        
        webAudioRef.current.ontimeupdate = () => {
          if (webAudioRef.current) {
            const pos = webAudioRef.current.currentTime;
            const dur = webAudioRef.current.duration || duration || 0;
            setCurrentPosition(pos);
            if (dur > 0) setProgress(pos / dur);
          }
        };

        webAudioRef.current.onended = () => {
          setIsPlaying(false);
          setProgress(0);
          setCurrentPosition(0);
        };
      }

      if (isPlaying) {
        webAudioRef.current.pause();
        setIsPlaying(false);
      } else {
        webAudioRef.current.play().catch(e => console.error("Web audio play failed", e));
        setIsPlaying(true);
      }
      return;
    }

    // --- MOBILE LOGIC (expo-av) ---
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);
        
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            if (status.durationMillis) {
              setProgress(status.positionMillis / status.durationMillis);
              setCurrentPosition(status.positionMillis / 1000);
            }
            if (status.didJustFinish) {
              setIsPlaying(false);
              newSound.setPositionAsync(0);
              setProgress(0);
              setCurrentPosition(0);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error playing sound', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const activeColor = isUser ? '#FFFFFF' : COLORS.primary;
  const inactiveColor = isUser ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)';
  const textColor = isUser ? '#FFFFFF' : COLORS.textSecondary;

  return (
    <View style={[styles.container, isUser && styles.containerUser]}>
      <TouchableOpacity onPress={handlePlayPause} activeOpacity={0.8}>
        {isUser ? (
          <View style={styles.playButtonUser}>
            <FontAwesome 
              name={isPlaying ? "pause" : "play"} 
              size={12} 
              color={COLORS.primary} 
            />
          </View>
        ) : (
          <LinearGradient
            colors={isPlaying ? ['#EF4444', '#DC2626'] : COLORS.primaryGradient as [string, string]}
            style={styles.playButton}
          >
            <FontAwesome 
              name={isPlaying ? "pause" : "play"} 
              size={12} 
              color="#FFF" 
            />
          </LinearGradient>
        )}
      </TouchableOpacity>
      
      <View style={styles.waveformContainer}>
        {bars.map((height, index) => {
          const barProgress = index / bars.length;
          const isActive = barProgress < progress;
          return (
            <View 
              key={index} 
              style={[
                styles.bar, 
                { 
                  height: 12 + (height * 16),
                  backgroundColor: isActive ? activeColor : inactiveColor
                }
              ]} 
            />
          );
        })}
      </View>
      
      <Text style={[styles.duration, { color: textColor }]}>
        {isPlaying ? formatDuration(currentPosition) : (duration ? formatDuration(duration) : '0:00')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    paddingRight: SPACING.md,
    marginTop: SPACING.xs,
    width: 240,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  containerUser: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    marginTop: 0,
    width: 220, // Slightly tighter in bubble
  },
  playButtonUser: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  waveformContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    gap: 2,
    marginRight: SPACING.md,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
  duration: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontFamily: FONTS.medium,
    fontVariant: ['tabular-nums'], // Fixed width numbers to avoid jitter
    minWidth: 35,
    textAlign: 'right',
  },
});
