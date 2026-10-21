import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Phase 0 — hello world that proves four things in Expo Go:
// 1. JavaScript runs (counter)
// 2. Local storage persists across app restarts (AsyncStorage)
// 3. Local notifications can be scheduled (expo-notifications)
// 4. The device/runtime info is visible, so we can debug remotely

const COUNTER_KEY = 'phase0.counter';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

type NotifStatus = 'unknown' | 'granted' | 'denied' | 'scheduled' | 'error';

export default function App() {
  const [counter, setCounter] = useState<number | null>(null);
  const [notifStatus, setNotifStatus] = useState<NotifStatus>('unknown');
  const [log, setLog] = useState<string[]>([]);

  const addLog = (line: string) =>
    setLog((prev) => [`${new Date().toLocaleTimeString()}  ${line}`, ...prev].slice(0, 8));

  // Load the persisted counter once on startup.
  useEffect(() => {
    AsyncStorage.getItem(COUNTER_KEY)
      .then((value) => {
        const n = value ? Number(value) : 0;
        setCounter(Number.isFinite(n) ? n : 0);
        addLog(`Loaded counter = ${value ?? '0 (first run)'}`);
      })
      .catch((e) => {
        setCounter(0);
        addLog(`Storage read failed: ${String(e)}`);
      });
  }, []);

  const increment = async () => {
    const next = (counter ?? 0) + 1;
    setCounter(next);
    try {
      await AsyncStorage.setItem(COUNTER_KEY, String(next));
    } catch (e) {
      addLog(`Storage write failed: ${String(e)}`);
    }
  };

  const reset = async () => {
    setCounter(0);
    await AsyncStorage.removeItem(COUNTER_KEY);
    addLog('Counter reset');
  };

  const testNotification = async () => {
    try {
      const current = await Notifications.getPermissionsAsync();
      let granted = current.granted;
      if (!granted) {
        const req = await Notifications.requestPermissionsAsync({
          ios: { allowAlert: true, allowBadge: true, allowSound: true },
        });
        granted = req.granted;
      }
      if (!granted) {
        setNotifStatus('denied');
        addLog('Notification permission denied — enable it in Settings > Expo Go');
        return;
      }
      setNotifStatus('granted');
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Planner says hi',
          body: 'Local notifications work. Phase 0 check passed.',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5,
        },
      });
      setNotifStatus('scheduled');
      addLog('Notification scheduled for 5 seconds from now — lock the phone or switch apps to see it');
    } catch (e) {
      setNotifStatus('error');
      addLog(`Notification error: ${String(e)}`);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Text style={styles.title}>Planner</Text>
        <Text style={styles.subtitle}>Phase 0 · hello world</Text>

        <View style={styles.card}>
          <Text style={styles.label}>1 · JavaScript + storage</Text>
          <Text style={styles.big}>{counter === null ? '…' : counter}</Text>
          <View style={styles.row}>
            <Pressable style={styles.button} onPress={increment}>
              <Text style={styles.buttonText}>Tap me</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonGhost]} onPress={reset}>
              <Text style={[styles.buttonText, styles.buttonGhostText]}>Reset</Text>
            </Pressable>
          </View>
          <Text style={styles.hint}>Close and reopen the app: the number should survive.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>2 · Local notifications</Text>
          <Pressable style={styles.button} onPress={testNotification}>
            <Text style={styles.buttonText}>Test notification (5 s)</Text>
          </Pressable>
          <Text style={styles.hint}>Status: {notifStatus}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>3 · Runtime</Text>
          <Text style={styles.mono}>
            {Platform.OS} {Platform.Version} ·{' '}
            {Platform.OS === 'ios' && Platform.isPad ? 'iPad' : 'phone'}
          </Text>
          {log.map((line, i) => (
            <Text key={i} style={styles.mono}>
              {line}
            </Text>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F4F6' },
  container: { flex: 1, padding: 20, gap: 16 },
  title: { fontSize: 32, fontWeight: '700', color: '#111' },
  subtitle: { fontSize: 16, color: '#666', marginTop: -12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  label: { fontSize: 13, fontWeight: '600', color: '#888', textTransform: 'uppercase' },
  big: { fontSize: 48, fontWeight: '700', color: '#111' },
  row: { flexDirection: 'row', gap: 10 },
  button: {
    backgroundColor: '#2F6BFF',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  buttonGhost: { backgroundColor: '#EEF1F7' },
  buttonGhostText: { color: '#2F6BFF' },
  hint: { fontSize: 13, color: '#777' },
  mono: { fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }), fontSize: 12, color: '#444' },
});
