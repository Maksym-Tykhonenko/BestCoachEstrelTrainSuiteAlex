import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Bestcoachtrainlay from '../bestcoachtraincmp/Bestcoachtrainlay';
import { useFocusEffect } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const STORAGE_SESSIONS = 'BESTCOACH_PLAN_SESSIONS';
const STORAGE_TASKS = 'BESTCOACH_PLAN_TASKS';

const Bestcoachtrainstts = () => {
  const [trainingsCount, setTrainingsCount] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [trainingDuration, setTrainingDuration] = useState(0);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const s = await AsyncStorage.getItem(STORAGE_SESSIONS);
          const t = await AsyncStorage.getItem(STORAGE_TASKS);

          let sessions = s ? JSON.parse(s) : [];
          let tasks = t ? JSON.parse(t) : [];

          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          const monthTrainings = sessions.filter(sess => {
            const d = new Date(sess.dateISO);
            return (
              d.getMonth() === currentMonth && d.getFullYear() === currentYear
            );
          });

          const totalDuration = monthTrainings.reduce(
            (sum, s) => sum + (s.durationMin || 0),
            0,
          );

          const completed = tasks.filter(t => t.done).length;

          setTrainingsCount(monthTrainings.length);
          setTrainingDuration(totalDuration);
          setTasksCompleted(completed);
        } catch (e) {
          console.log('error', e);
        }
      })();
    }, []),
  );

  return (
    <Bestcoachtrainlay>
      <View style={styles.container}>
        <Text style={styles.title}>STATS</Text>

        <View style={styles.card}>
          <View style={styles.textcont}>
            <Text style={styles.cardLabel}>Trainings this month:</Text>
          </View>
          <View style={styles.cardValueBox}>
            <Text style={styles.cardValue}>{trainingsCount}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.textcont}>
            <Text style={styles.cardLabel}>Tasks completed:</Text>
          </View>

          <View style={styles.cardValueBox}>
            <Text style={styles.cardValue}>{tasksCompleted}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.textcont}>
            <Text style={styles.cardLabel}>Training duration:</Text>
          </View>

          <View style={styles.cardValueBox}>
            <Text style={styles.cardValue}>{trainingDuration} min</Text>
          </View>
        </View>
      </View>
    </Bestcoachtrainlay>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.08,
    paddingBottom: 120,
  },
  textcont: {
    padding: 16,
    backgroundColor: '#000922',
    borderRadius: 16,
    flex: 1,
    marginRight: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#001B61',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  cardValueBox: {
    backgroundColor: '#FFBF31',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardValue: {
    color: '#000922',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Bestcoachtrainstts;
