import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import Bestcoachtrainlay from '../bestcoachtraincmp/Bestcoachtrainlay';
import { useStore } from '../bestcoachtrainst/bestCoachTrainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from '@react-native-community/blur';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Orientation from 'react-native-orientation-locker';

const { height: dtstTrainHeight, width: dtstTrainWidth } =
  Dimensions.get('window');

const dtstTrainSTORAGE_SESSIONS = 'BESTCOACH_PLAN_SESSIONS';
const dtstTrainSTORAGE_TASKS = 'BESTCOACH_PLAN_TASKS';

const dtstTrainSPORT_TYPES = [
  '⚽ Football / Soccer',
  '🏀 Basketball',
  '🏐 Volleyball',
  '🏃 Athletics / Track & Field',
  '🏒 Hockey',
  '🏈 Rugby',
  '⚾ Baseball',
  '🎾 Tennis',
  '🏸 Badminton',
  '🤸 Gymnastics',
  '🥋 Martial Arts',
  '🏊 Swimming',
];

const dtstTrainSESSION_COLORS = [
  '#1DD75B',
  '#FF8A00',
  '#2AD3FF',
  '#8A64FF',
  '#FF4D4F',
];

const dtstTrainPad = n => (n < 10 ? `0${n}` : `${n}`);
const dtstTrainSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const dtstTrainFormatHm = d =>
  `${dtstTrainPad(d.getHours())}:${dtstTrainPad(d.getMinutes())}`;
const dtstTrainAddMinutes = (date, minutes) =>
  new Date(date.getTime() + minutes * 60 * 1000);
const dtstTrainDaysStrip = (centerDate = new Date(), before = 2, after = 2) => {
  const arr = [];
  for (let i = -before; i <= after; i++) {
    const d = new Date(centerDate);
    d.setDate(centerDate.getDate() + i);
    arr.push(d);
  }
  return arr;
};
const dtstTrainWeekdayShort = d =>
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
const dtstTrainMonthShort = d =>
  [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ][d.getMonth()];

const Bestcoachtrainpl = () => {
  const {
    teams: dtstTrainTeams,
    bestTrainNotificationsEnabled: dtstTrainBestTrainNotificationsEnabled,
  } = useStore();

  const [dtstTrainTab, dtstTrainSetTab] = useState('calendar');
  const [dtstTrainSessions, dtstTrainSetSessions] = useState([]);
  const [dtstTrainSessionModal, dtstTrainSetSessionModal] = useState(false);
  const [dtstTrainDeleteSessionModal, dtstTrainSetDeleteSessionModal] =
    useState(false);
  const [dtstTrainSessionToDelete, dtstTrainSetSessionToDelete] =
    useState(null);
  const [dtstTrainTasks, dtstTrainSetTasks] = useState([]);
  const [dtstTrainTaskModal, dtstTrainSetTaskModal] = useState(false);
  const [dtstTrainDeleteTaskModal, dtstTrainSetDeleteTaskModal] =
    useState(false);
  const [dtstTrainTaskToDelete, dtstTrainSetTaskToDelete] = useState(null);
  const [dtstTrainSelectedDate, dtstTrainSetSelectedDate] = useState(
    new Date(),
  );
  const [dtstTrainSearch, dtstTrainSetSearch] = useState('');
  const [dtstTrainTitle, dtstTrainSetTitle] = useState('');
  const [dtstTrainSportType, dtstTrainSetSportType] = useState('');
  const [dtstTrainTeamId, dtstTrainSetTeamId] = useState('');
  const [dtstTrainPickerShown, dtstTrainSetPickerShown] = useState(false);
  const [dtstTrainDateTime, dtstTrainSetDateTime] = useState(new Date());
  const [dtstTrainDuration, dtstTrainSetDuration] = useState('30');
  const [dtstTrainLocation, dtstTrainSetLocation] = useState('');
  const [dtstTrainNotes, dtstTrainSetNotes] = useState('');
  const [dtstTrainRepeat, dtstTrainSetRepeat] = useState(false);
  const [dtstTrainSportDropdown, dtstTrainSetSportDropdown] = useState(false);
  const [dtstTrainTeamDropdown, dtstTrainSetTeamDropdown] = useState(false);
  const [dtstTrainTaskText, dtstTrainSetTaskText] = useState('');
  const [dtstTrainTaskDate, dtstTrainSetTaskDate] = useState(new Date());
  const [dtstTrainTaskPickerShown, dtstTrainSetTaskPickerShown] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      Platform.OS === 'android' &&
        (dtstTrainTaskModal ||
          dtstTrainDeleteTaskModal ||
          dtstTrainSessionModal ||
          dtstTrainDeleteSessionModal) &&
        Orientation.lockToPortrait();

      return () => Orientation.unlockAllOrientations();
    }, [
      dtstTrainTaskModal,
      dtstTrainDeleteTaskModal,
      dtstTrainSessionModal,
      dtstTrainDeleteSessionModal,
    ]),
  );

  const dtstTrainStrip = useMemo(
    () => dtstTrainDaysStrip(dtstTrainSelectedDate, 2, 2),
    [dtstTrainSelectedDate],
  );

  useEffect(() => {
    (async () => {
      try {
        const s = await AsyncStorage.getItem(dtstTrainSTORAGE_SESSIONS);
        const t = await AsyncStorage.getItem(dtstTrainSTORAGE_TASKS);
        if (s) dtstTrainSetSessions(JSON.parse(s));
        if (t) dtstTrainSetTasks(JSON.parse(t));
      } catch (e) {
        console.log('Load plan error', e);
      }
    })();
  }, []);

  const {
    setBestTrainNotificationsEnabled: dtstTrainSetBestTrainNotificationsEnabled,
  } = useStore();

  useFocusEffect(
    useCallback(() => {
      dtstTrainLoadBestTrainNotifications();
    }, []),
  );

  const dtstTrainLoadBestTrainNotifications = async () => {
    try {
      const notifValue = await AsyncStorage.getItem(
        'best_train_app_notifications',
      );
      if (notifValue !== null)
        dtstTrainSetBestTrainNotificationsEnabled(JSON.parse(notifValue));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    AsyncStorage.setItem(
      dtstTrainSTORAGE_SESSIONS,
      JSON.stringify(dtstTrainSessions),
    ).catch(() => {});
  }, [dtstTrainSessions]);
  useEffect(() => {
    AsyncStorage.setItem(
      dtstTrainSTORAGE_TASKS,
      JSON.stringify(dtstTrainTasks),
    ).catch(() => {});
  }, [dtstTrainTasks]);

  const dtstTrainOnSaveSession = () => {
    if (dtstTrainBestTrainNotificationsEnabled)
      Toast.show({ text1: 'Session created successfully!' });
    if (
      !dtstTrainTitle.trim() ||
      !dtstTrainSportType.trim() ||
      !dtstTrainTeamId.trim()
    )
      return;

    const color =
      dtstTrainSESSION_COLORS[
        Math.floor(Math.random() * dtstTrainSESSION_COLORS.length)
      ];
    const newSession = {
      id: Date.now().toString(),
      title: dtstTrainTitle.trim(),
      sportType: dtstTrainSportType,
      teamId: dtstTrainTeamId,
      teamName: dtstTrainTeams.find(t => t.id === dtstTrainTeamId)?.name || '',
      dateISO: dtstTrainDateTime.toISOString(),
      durationMin: parseInt(dtstTrainDuration || '0', 10) || 0,
      location: dtstTrainLocation.trim(),
      notes: dtstTrainNotes.trim(),
      repeat: !!dtstTrainRepeat,
      color,
    };
    dtstTrainSetSessions(prev => [...prev, newSession]);
    dtstTrainSetTitle('');
    dtstTrainSetSportType('');
    dtstTrainSetTeamId('');
    dtstTrainSetDateTime(new Date());
    dtstTrainSetDuration('75');
    dtstTrainSetLocation('');
    dtstTrainSetNotes('');
    dtstTrainSetRepeat(false);
    dtstTrainSetSportDropdown(false);
    dtstTrainSetTeamDropdown(false);
    dtstTrainSetSessionModal(false);
  };

  const dtstTrainConfirmDeleteSession = s => {
    dtstTrainSetSessionToDelete(s);
    dtstTrainSetDeleteSessionModal(true);
  };
  const dtstTrainOnDeleteSession = () => {
    if (dtstTrainBestTrainNotificationsEnabled)
      Toast.show({ text1: 'Session deleted successfully!' });
    dtstTrainSetSessions(prev =>
      prev.filter(s => s.id !== dtstTrainSessionToDelete.id),
    );
    dtstTrainSetSessionToDelete(null);
    dtstTrainSetDeleteSessionModal(false);
  };

  const dtstTrainOnSaveTask = () => {
    if (dtstTrainBestTrainNotificationsEnabled)
      Toast.show({ text1: 'Task created successfully!' });
    if (!dtstTrainTaskText.trim()) return;
    const task = {
      id: Date.now().toString(),
      text: dtstTrainTaskText.trim(),
      dateISO: dtstTrainTaskDate.toISOString(),
      done: false,
    };
    dtstTrainSetTasks(prev => [...prev, task]);
    dtstTrainSetTaskText('');
    dtstTrainSetTaskDate(new Date());
    dtstTrainSetTaskModal(false);
  };

  const dtstTrainToggleTask = id =>
    dtstTrainSetTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  const dtstTrainConfirmDeleteTask = task => {
    dtstTrainSetTaskToDelete(task);
    dtstTrainSetDeleteTaskModal(true);
  };
  const dtstTrainOnDeleteTask = () => {
    if (dtstTrainBestTrainNotificationsEnabled)
      Toast.show({ text1: 'Task deleted successfully!' });
    dtstTrainSetTasks(prev =>
      prev.filter(t => t.id !== dtstTrainTaskToDelete.id),
    );
    dtstTrainSetTaskToDelete(null);
    dtstTrainSetDeleteTaskModal(false);
  };

  const dtstTrainSessionsForDay = useMemo(() => {
    const lower = dtstTrainSearch.trim().toLowerCase();
    return dtstTrainSessions
      .filter(s => dtstTrainSameDay(new Date(s.dateISO), dtstTrainSelectedDate))
      .filter(
        s =>
          !lower ||
          (s.title + ' ' + s.teamName + ' ' + s.location)
            .toLowerCase()
            .includes(lower),
      )
      .sort((a, b) => new Date(a.dateISO) - new Date(b.dateISO));
  }, [dtstTrainSessions, dtstTrainSelectedDate, dtstTrainSearch]);

  const dtstTrainTasksGrouped = useMemo(() => {
    const byDay = {};
    dtstTrainTasks
      .sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO))
      .forEach(t => {
        const d = new Date(t.dateISO);
        const key = `${d.getFullYear()}-${dtstTrainPad(
          d.getMonth() + 1,
        )}-${dtstTrainPad(d.getDate())}`;
        if (!byDay[key]) byDay[key] = [];
        byDay[key].push(t);
      });
    return byDay;
  }, [dtstTrainTasks]);

  const dtstTrainFormatDateDisplay = d =>
    `${d.getDate()} ${dtstTrainMonthShort(d)} ${dtstTrainFormatHm(d)}`;

  const DtstTrainSessionCard = ({ item }) => {
    const start = new Date(item.dateISO);
    const end = dtstTrainAddMinutes(start, item.durationMin || 0);
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={() => dtstTrainConfirmDeleteSession(item)}
        style={dtstTrainStyles.dtstTrainSessionCard}
      >
        <View style={dtstTrainStyles.dtstTrainSessionHeader}>
          <View style={dtstTrainStyles.dtstTrainSessionTitleBadge}>
            <Text style={dtstTrainStyles.dtstTrainSessionTitleText}>
              {item.title}
            </Text>
          </View>
          <View
            style={[
              dtstTrainStyles.dtstTrainSessionDot,
              { backgroundColor: item.color || '#1DD75B' },
            ]}
          />
        </View>
        <View style={dtstTrainStyles.dtstTrainTeamRow}>
          <Text style={dtstTrainStyles.dtstTrainTeamRowText}>
            {item.teamName || 'Team'}
          </Text>
        </View>
        <Text style={dtstTrainStyles.dtstTrainTimeText}>
          {dtstTrainFormatHm(start)}–{dtstTrainFormatHm(end)}
          {item.location ? ` • ${item.location}` : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  const dtstTrainEmptyCalendar = () => (
    <View style={{ alignItems: 'center', marginTop: 50 }}>
      <Image source={require('../../assets/images/trainempt.png')} />
      <Text style={dtstTrainStyles.dtstTrainEmptyText}>
        No sessions yet. Tap + to plan your first one!
      </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        style={dtstTrainStyles.dtstTrainAddButtonEmpty}
        onPress={() => dtstTrainSetSessionModal(true)}
      >
        <Image source={require('../../assets/images/trainadd.png')} />
      </TouchableOpacity>
    </View>
  );

  const dtstTrainEmptyTodo = () => (
    <View style={{ alignItems: 'center', marginTop: 80, marginBottom: 100 }}>
      <Image source={require('../../assets/images/trainempt.png')} />
      <Text style={dtstTrainStyles.dtstTrainEmptyText}>
        No tasks yet. Add your first one to stay organized!
      </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[dtstTrainStyles.dtstTrainAddButtonEmpty]}
        onPress={() => dtstTrainSetTaskModal(true)}
      >
        <Image source={require('../../assets/images/trainadd.png')} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Bestcoachtrainlay>
      <View style={[dtstTrainStyles.dtstTrainContainer]}>
        <Text style={dtstTrainStyles.dtstTrainTitle}>PLAN</Text>

        <View style={dtstTrainStyles.dtstTrainTabsRow}>
          <TouchableOpacity
            style={[
              dtstTrainStyles.dtstTrainTab,
              dtstTrainTab === 'calendar'
                ? dtstTrainStyles.dtstTrainTabActive
                : dtstTrainStyles.dtstTrainTabInactive,
            ]}
            onPress={() => dtstTrainSetTab('calendar')}
          >
            <Text
              style={[
                dtstTrainStyles.dtstTrainTabText,
                dtstTrainTab === 'calendar'
                  ? dtstTrainStyles.dtstTrainTabTextActive
                  : dtstTrainStyles.dtstTrainTabTextInactive,
              ]}
            >
              Calendar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              dtstTrainStyles.dtstTrainTab,
              dtstTrainTab === 'todo'
                ? dtstTrainStyles.dtstTrainTabActive
                : dtstTrainStyles.dtstTrainTabInactive,
            ]}
            onPress={() => dtstTrainSetTab('todo')}
          >
            <Text
              style={[
                dtstTrainStyles.dtstTrainTabText,
                dtstTrainTab === 'todo'
                  ? dtstTrainStyles.dtstTrainTabTextActive
                  : dtstTrainStyles.dtstTrainTabTextInactive,
              ]}
            >
              Quick To-Do
            </Text>
          </TouchableOpacity>
        </View>

        {dtstTrainTab === 'calendar' ? (
          <>
            <View style={dtstTrainStyles.dtstTrainTodayRow}>
              <Text style={dtstTrainStyles.dtstTrainTodayLabel}>TODAY</Text>
              <TouchableOpacity
                style={dtstTrainStyles.dtstTrainTopPlus}
                onPress={() => dtstTrainSetSessionModal(true)}
                activeOpacity={0.8}
              >
                <Image source={require('../../assets/images/trainadd.png')} />
              </TouchableOpacity>
            </View>

            <View style={dtstTrainStyles.dtstTrainStripRow}>
              {dtstTrainStrip.map((d, idx) => {
                const active = dtstTrainSameDay(d, dtstTrainSelectedDate);
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      dtstTrainStyles.dtstTrainStripItem,
                      active && dtstTrainStyles.dtstTrainStripItemActive,
                    ]}
                    onPress={() => dtstTrainSetSelectedDate(d)}
                  >
                    <Text
                      style={[
                        dtstTrainStyles.dtstTrainStripDayNumber,
                        active && dtstTrainStyles.dtstTrainStripDayNumberActive,
                      ]}
                    >
                      {dtstTrainPad(d.getDate())}
                    </Text>
                    <Text
                      style={[
                        dtstTrainStyles.dtstTrainStripWeek,
                        active && dtstTrainStyles.dtstTrainStripWeekActive,
                      ]}
                    >
                      {dtstTrainWeekdayShort(d)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View>
              {dtstTrainSessionsForDay.length === 0 && dtstTrainEmptyCalendar()}
              <FlatList
                data={dtstTrainSessionsForDay}
                keyExtractor={i => i.id}
                renderItem={({ item }) => <DtstTrainSessionCard item={item} />}
                style={{ width: '100%' }}
                contentContainerStyle={{ paddingBottom: 140 }}
                scrollEnabled={false}
              />
            </View>
          </>
        ) : (
          <>
            {Object.keys(dtstTrainTasksGrouped).length === 0 ? (
              dtstTrainEmptyTodo()
            ) : (
              <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={{ paddingBottom: 140 }}
                showsVerticalScrollIndicator={false}
              >
                {Object.entries(dtstTrainTasksGrouped)
                  .sort(([aKey], [bKey]) => new Date(bKey) - new Date(aKey))
                  .map(([key, list]) => {
                    const [y, m, d] = key.split('-').map(n => parseInt(n, 10));
                    const dt = new Date(y, m - 1, d);
                    return (
                      <View key={key} style={{ marginBottom: 14 }}>
                        <Text style={dtstTrainStyles.dtstTrainSectionTitle}>
                          {dtstTrainPad(dt.getDate())} {dtstTrainMonthShort(dt)}
                        </Text>
                        {list.map(t => (
                          <Pressable
                            key={t.id}
                            onLongPress={() => dtstTrainConfirmDeleteTask(t)}
                            style={dtstTrainStyles.dtstTrainTaskCard}
                          >
                            <TouchableOpacity
                              style={[
                                dtstTrainStyles.dtstTrainTaskCircle,
                                t.done &&
                                  dtstTrainStyles.dtstTrainTaskCircleDone,
                              ]}
                              onPress={() => dtstTrainToggleTask(t.id)}
                            >
                              {t.done && (
                                <Image
                                  source={require('../../assets/images/traincheck.png')}
                                  style={{ tintColor: '#FFBF31' }}
                                />
                              )}
                            </TouchableOpacity>
                            <Text
                              style={[
                                dtstTrainStyles.dtstTrainTaskText,
                                t.done && dtstTrainStyles.dtstTrainTaskTextDone,
                              ]}
                              numberOfLines={1}
                            >
                              {t.text}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    );
                  })}
              </ScrollView>
            )}
          </>
        )}
      </View>

      {Object.keys(dtstTrainTasksGrouped).length !== 0 &&
        dtstTrainTab === 'todo' && (
          <View style={{ position: 'absolute', bottom: 140, right: 24 }}>
            <TouchableOpacity
              style={dtstTrainStyles.dtstTrainInlinePlus}
              onPress={() => dtstTrainSetTaskModal(true)}
            >
              <Image source={require('../../assets/images/trainadd.png')} />
            </TouchableOpacity>
          </View>
        )}

      {(dtstTrainSessionModal ||
        dtstTrainDeleteSessionModal ||
        dtstTrainTaskModal ||
        dtstTrainDeleteTaskModal) &&
        Platform.OS === 'ios' && (
          <BlurView
            style={dtstTrainStyles.dtstTrainBlur}
            blurType="dark"
            blurAmount={4}
          />
        )}

      <Modal transparent animationType="fade" visible={dtstTrainSessionModal}>
        <View style={dtstTrainStyles.dtstTrainModalOverlay}>
          <View style={dtstTrainStyles.dtstTrainModalBox}>
            <Text style={dtstTrainStyles.dtstTrainModalTitle}>
              TRAINING SESSION
            </Text>

            <TextInput
              placeholder="Title"
              value={dtstTrainTitle}
              onChangeText={dtstTrainSetTitle}
              placeholderTextColor="#FFFFFF"
              style={dtstTrainStyles.dtstTrainModalInput}
            />

            <View
              style={{ width: '100%', position: 'relative', marginBottom: 12 }}
            >
              <TouchableOpacity
                style={[
                  dtstTrainStyles.dtstTrainModalSelect,
                  dtstTrainSportDropdown && {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                ]}
                onPress={() => {
                  dtstTrainSetSportDropdown(p => !p);
                  dtstTrainSetTeamDropdown(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={dtstTrainStyles.dtstTrainModalSelectText}>
                  {dtstTrainSportType || 'Sport type'}
                </Text>
                <Image
                  source={require('../../assets/images/traindropdown.png')}
                  style={{ width: 18, height: 18, tintColor: '#FFFFFF' }}
                />
              </TouchableOpacity>
              {dtstTrainSportDropdown && (
                <View style={dtstTrainStyles.dtstTrainDropdown}>
                  <ScrollView style={{ maxHeight: 200 }}>
                    {dtstTrainSPORT_TYPES.map((s, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          dtstTrainStyles.dtstTrainDropdownItem,
                          dtstTrainSportType === s && {
                            backgroundColor: '#002C8A',
                          },
                        ]}
                        onPress={() => {
                          dtstTrainSetSportType(s);
                          dtstTrainSetSportDropdown(false);
                        }}
                      >
                        <Text style={dtstTrainStyles.dtstTrainDropdownText}>
                          {s}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View
              style={{ width: '100%', position: 'relative', marginBottom: 12 }}
            >
              {dtstTrainTeams.length === 0 ? (
                <TextInput
                  placeholder="Team name"
                  value={dtstTrainTeamId}
                  onChangeText={dtstTrainSetTeamId}
                  placeholderTextColor="#FFFFFF"
                  style={dtstTrainStyles.dtstTrainModalInput}
                />
              ) : (
                <>
                  <TouchableOpacity
                    style={[
                      dtstTrainStyles.dtstTrainModalSelect,
                      dtstTrainTeamDropdown && {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                      },
                    ]}
                    onPress={() => {
                      dtstTrainSetTeamDropdown(p => !p);
                      dtstTrainSetSportDropdown(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={dtstTrainStyles.dtstTrainModalSelectText}>
                      {dtstTrainTeamId
                        ? dtstTrainTeams.find(t => t.id === dtstTrainTeamId)
                            ?.name || dtstTrainTeamId
                        : 'Team'}
                    </Text>
                    <Image
                      source={require('../../assets/images/traindropdown.png')}
                      style={{ width: 18, height: 18, tintColor: '#FFFFFF' }}
                    />
                  </TouchableOpacity>
                  {dtstTrainTeamDropdown && (
                    <View style={dtstTrainStyles.dtstTrainDropdown}>
                      <ScrollView style={{ maxHeight: 200 }}>
                        {dtstTrainTeams.map(t => (
                          <TouchableOpacity
                            key={t.id}
                            style={[
                              dtstTrainStyles.dtstTrainDropdownItem,
                              dtstTrainTeamId === t.id && {
                                backgroundColor: '#002C8A',
                              },
                            ]}
                            onPress={() => {
                              dtstTrainSetTeamId(t.id);
                              dtstTrainSetTeamDropdown(false);
                            }}
                          >
                            <Text style={dtstTrainStyles.dtstTrainDropdownText}>
                              {t.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </>
              )}
            </View>

            <TouchableOpacity
              style={dtstTrainStyles.dtstTrainModalSelect}
              activeOpacity={0.8}
              onPress={() => {
                if (Platform.OS === 'android') {
                  DateTimePickerAndroid.open({
                    value: dtstTrainDateTime,
                    mode: 'datetime',
                    is24Hour: true,
                    onChange: (event, date) => {
                      if (event.type === 'set' && date) {
                        dtstTrainSetDateTime(date);
                      }
                    },
                  });
                } else {
                  dtstTrainSetPickerShown(true);
                }
              }}
            >
              <Text style={dtstTrainStyles.dtstTrainModalSelectText}>
                {dtstTrainFormatDateDisplay(dtstTrainDateTime)}
              </Text>
              <Image
                source={require('../../assets/images/traincalend.png')}
                style={{ width: 18, height: 18, tintColor: '#FFFFFF' }}
              />
            </TouchableOpacity>

            {Platform.OS === 'ios' && dtstTrainPickerShown && (
              <>
                <DateTimePicker
                  value={dtstTrainDateTime}
                  mode="datetime"
                  display="inline"
                  onChange={(e, d) => d && dtstTrainSetDateTime(d)}
                />
                <TouchableOpacity
                  style={[
                    dtstTrainStyles.dtstTrainModalButton,
                    {
                      backgroundColor: '#FFBF31',
                      marginTop: 8,
                      marginBottom: 12,
                    },
                  ]}
                  onPress={() => dtstTrainSetPickerShown(false)}
                >
                  <Text style={dtstTrainStyles.dtstTrainModalButtonText}>
                    Done
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <View style={[dtstTrainStyles.dtstTrainInputWithSuffix]}>
              <TextInput
                placeholder="Duration"
                value={dtstTrainDuration}
                onChangeText={dtstTrainSetDuration}
                keyboardType="number-pad"
                placeholderTextColor="#FFFFFF"
                style={[
                  dtstTrainStyles.dtstTrainModalInput,
                  { marginBottom: 0, flex: 1 },
                ]}
              />
              <Text style={dtstTrainStyles.dtstTrainSuffixText}>min</Text>
            </View>

            <TextInput
              placeholder="Location"
              value={dtstTrainLocation}
              onChangeText={dtstTrainSetLocation}
              placeholderTextColor="#FFFFFF"
              style={dtstTrainStyles.dtstTrainModalInput}
            />

            <TextInput
              placeholder="Notes"
              value={dtstTrainNotes}
              onChangeText={dtstTrainSetNotes}
              placeholderTextColor="#FFFFFF"
              style={dtstTrainStyles.dtstTrainModalInput}
            />

            <View style={dtstTrainStyles.dtstTrainRepeatRow}>
              <Text style={dtstTrainStyles.dtstTrainRepeatLabel}>Repeat</Text>
              <Switch
                value={dtstTrainRepeat}
                onValueChange={dtstTrainSetRepeat}
                thumbColor={'#eee'}
                trackColor={{ false: '#000922', true: '#FFBF31' }}
              />
            </View>

            <TouchableOpacity
              style={[
                dtstTrainStyles.dtstTrainModalButton,
                { backgroundColor: '#FFBF31', marginTop: 6 },
                (!dtstTrainTitle ||
                  !dtstTrainSportType ||
                  !dtstTrainTeamId) && { backgroundColor: '#FFBF31B2' },
              ]}
              onPress={dtstTrainOnSaveSession}
            >
              <Text style={dtstTrainStyles.dtstTrainModalButtonText}>
                Save Session
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                dtstTrainSetSessionModal(false);
                dtstTrainSetNotes('');
                dtstTrainSetDateTime(new Date());
                dtstTrainSetTitle('');
                dtstTrainSetLocation('');
                dtstTrainSetRepeat(false);
                dtstTrainSetSportType('');
                dtstTrainSetTeamId('');
              }}
            >
              <Text style={dtstTrainStyles.dtstTrainModalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="fade" visible={dtstTrainTaskModal}>
        <View style={dtstTrainStyles.dtstTrainModalOverlay}>
          <View style={dtstTrainStyles.dtstTrainModalBox}>
            <Text style={dtstTrainStyles.dtstTrainModalTitle}>ADD TASK</Text>

            <TextInput
              placeholder="New task"
              value={dtstTrainTaskText}
              onChangeText={dtstTrainSetTaskText}
              placeholderTextColor="#FFFFFFB2"
              style={dtstTrainStyles.dtstTrainModalInput}
            />

            <TouchableOpacity
              style={dtstTrainStyles.dtstTrainModalSelect}
              onPress={() => {
                if (Platform.OS === 'android') {
                  DateTimePickerAndroid.open({
                    value: dtstTrainTaskDate,
                    mode: 'date',
                    is24Hour: true,
                    onChange: (event, date) => {
                      if (event.type === 'set' && date) {
                        dtstTrainSetTaskDate(date);
                      }
                    },
                  });
                } else {
                  dtstTrainSetTaskPickerShown(true);
                }
              }}
            >
              <Text style={dtstTrainStyles.dtstTrainModalSelectText}>
                {`Date: ${dtstTrainTaskDate.toLocaleDateString()}`}
              </Text>
              <Image
                source={require('../../assets/images/traincalend.png')}
                style={{ width: 18, height: 18, tintColor: '#FFFFFFB2' }}
              />
            </TouchableOpacity>

            {Platform.OS === 'ios' && dtstTrainTaskPickerShown && (
              <>
                <DateTimePicker
                  value={dtstTrainTaskDate}
                  mode="date"
                  display="inline"
                  onChange={(e, d) => d && dtstTrainSetTaskDate(d)}
                />
                <TouchableOpacity
                  style={[
                    dtstTrainStyles.dtstTrainModalButton,
                    {
                      backgroundColor: '#FFBF31',
                      marginTop: 8,
                      marginBottom: 12,
                    },
                  ]}
                  onPress={() => dtstTrainSetTaskPickerShown(false)}
                >
                  <Text style={dtstTrainStyles.dtstTrainModalButtonText}>
                    Done
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={[
                dtstTrainStyles.dtstTrainModalButton,
                { backgroundColor: '#FFBF31', marginTop: 10 },
                !dtstTrainTaskText && { backgroundColor: '#FFBF31B2' },
              ]}
              onPress={dtstTrainOnSaveTask}
            >
              <Text style={dtstTrainStyles.dtstTrainModalButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                dtstTrainSetTaskModal(false);
                dtstTrainSetTaskText('');
                dtstTrainSetTaskDate(new Date());
              }}
            >
              <Text style={dtstTrainStyles.dtstTrainModalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={dtstTrainDeleteSessionModal}
      >
        {Platform.OS === 'ios' && (
          <BlurView
            style={dtstTrainStyles.dtstTrainBlur}
            blurType="dark"
            blurAmount={4}
          />
        )}
        <View style={dtstTrainStyles.dtstTrainDeleteOverlay}>
          <View style={dtstTrainStyles.dtstTrainDeleteBox}>
            <Text style={dtstTrainStyles.dtstTrainDeleteTitle}>
              Delete session?
            </Text>
            <Text style={dtstTrainStyles.dtstTrainDeleteMessage}>
              Are you sure you want to delete this training session?{'\n'}This
              action cannot be undone.
            </Text>

            <View style={dtstTrainStyles.dtstTrainDeleteButtons}>
              <TouchableOpacity
                style={dtstTrainStyles.dtstTrainDeleteCancelBtn}
                onPress={() => dtstTrainSetDeleteSessionModal(false)}
              >
                <Text style={dtstTrainStyles.dtstTrainDeleteCancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={dtstTrainStyles.dtstTrainDeleteConfirmBtn}
                onPress={dtstTrainOnDeleteSession}
              >
                <Text style={dtstTrainStyles.dtstTrainDeleteConfirmText}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={dtstTrainDeleteTaskModal}
      >
        {Platform.OS === 'ios' && (
          <BlurView
            style={dtstTrainStyles.besttrainBlur}
            blurType="dark"
            blurAmount={4}
          />
        )}
        <View style={dtstTrainStyles.dtstTrainDeleteOverlay}>
          <View style={dtstTrainStyles.dtstTrainDeleteBox}>
            <Text style={dtstTrainStyles.dtstTrainDeleteTitle}>
              Delete task?
            </Text>
            <Text style={dtstTrainStyles.dtstTrainDeleteMessage}>
              Are you sure you want to delete this task?{'\n'}This action cannot
              be undone.
            </Text>

            <View style={dtstTrainStyles.dtstTrainDeleteButtons}>
              <TouchableOpacity
                style={dtstTrainStyles.dtstTrainDeleteCancelBtn}
                onPress={() => dtstTrainSetDeleteTaskModal(false)}
              >
                <Text style={dtstTrainStyles.dtstTrainDeleteCancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={dtstTrainStyles.dtstTrainDeleteConfirmBtn}
                onPress={dtstTrainOnDeleteTask}
              >
                <Text style={dtstTrainStyles.dtstTrainDeleteConfirmText}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Bestcoachtrainlay>
  );
};

const dtstTrainStyles = StyleSheet.create({
  dtstTrainContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: dtstTrainHeight * 0.08,
  },
  dtstTrainSectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 16,
  },
  besttrainBlur: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  dtstTrainTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  dtstTrainTabsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  dtstTrainTab: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dtstTrainTabActive: { backgroundColor: '#FFBF31' },
  dtstTrainTabInactive: { backgroundColor: '#0C2C79' },
  dtstTrainTabText: { fontSize: 15, fontWeight: '700' },
  dtstTrainTabTextActive: { color: '#000922' },
  dtstTrainTabTextInactive: { color: '#E5EAFB' },
  dtstTrainTodayRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dtstTrainTodayLabel: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  dtstTrainTopPlus: {
    width: 44,
    height: 44,
    backgroundColor: '#FFBF31',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dtstTrainStripRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginBottom: 12,
  },
  dtstTrainStripItem: {
    width: '18%',
    height: 64,
    backgroundColor: '#0C2C79',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dtstTrainStripItemActive: { backgroundColor: '#2A52FF' },
  dtstTrainStripDayNumber: {
    color: '#BFD0FF',
    fontWeight: '700',
    fontSize: 18,
  },
  dtstTrainDeleteOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000066',
  },
  dtstTrainDeleteBox: {
    width: '80%',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  dtstTrainDeleteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  dtstTrainDeleteMessage: {
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  dtstTrainDeleteButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dtstTrainDeleteCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    borderRightWidth: 1,
  },
  dtstTrainDeleteConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  dtstTrainDeleteCancelText: {
    fontWeight: '600',
    color: '#000',
  },
  dtstTrainDeleteConfirmText: {
    fontWeight: '600',
    color: '#E53935',
  },

  dtstTrainStripDayNumberActive: { color: '#FFFFFF' },
  dtstTrainStripWeek: { color: '#BFD0FF', marginTop: 2, fontSize: 12 },
  dtstTrainStripWeekActive: { color: '#EAF0FF' },
  dtstTrainSessionCard: {
    backgroundColor: '#0C2C79',
    borderRadius: 14,
    padding: 14,
    marginBottom: 11,
  },
  dtstTrainSessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dtstTrainSessionTitleBadge: {
    backgroundColor: '#000C2A',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 8,
  },
  dtstTrainSessionTitleText: { color: '#FFFFFF', fontWeight: '700' },
  dtstTrainSessionDot: { width: 32, height: 32, borderRadius: 50 },
  dtstTrainTeamRow: {
    marginTop: 5,
    backgroundColor: '#000C2A',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  dtstTrainTeamRowText: { color: '#FFBF31', fontWeight: '700' },
  dtstTrainTimeText: {
    marginTop: 16,
    color: '#FFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  dtstTrainEmptyText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    fontWeight: '500',
    width: dtstTrainWidth * 0.8,
  },
  dtstTrainAddButtonEmpty: {
    width: 48,
    height: 48,
    backgroundColor: '#FFBF31',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  dtstTrainInlinePlus: {
    width: 44,
    height: 44,
    backgroundColor: '#FFBF31',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  dtstTrainModalOverlay: {
    flex: 1,
    backgroundColor: '#00000054',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dtstTrainModalBox: {
    width: '85%',
    backgroundColor: '#001B61',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  dtstTrainModalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
  },
  dtstTrainModalInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#000922',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
  },
  dtstTrainModalSelect: {
    width: '100%',
    height: 50,
    backgroundColor: '#000922',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  dtstTrainModalSelectText: { color: '#FFFFFF', fontSize: 16 },
  dtstTrainDropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#000922',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 1000,
    elevation: 10,
  },
  dtstTrainDropdownItem: { paddingVertical: 10, paddingHorizontal: 16 },
  dtstTrainDropdownText: { color: '#FFFFFF', fontSize: 16 },
  dtstTrainInputWithSuffix: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 12,
  },
  dtstTrainSuffixText: {
    color: '#FFFFFF',
    position: 'absolute',
    right: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  dtstTrainRepeatRow: {
    width: '100%',
    height: 50,
    backgroundColor: '#000922',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dtstTrainRepeatLabel: { color: '#FFFFFF', fontSize: 16 },
  dtstTrainModalButton: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dtstTrainModalButtonText: {
    color: '#000922',
    fontSize: 16,
    fontWeight: '600',
  },
  dtstTrainModalCancel: {
    color: '#FFFFFF',
    marginTop: 14,
    fontSize: 16,
    fontWeight: '500',
  },
  dtstTrainTaskCard: {
    backgroundColor: '#0C2C79',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dtstTrainTaskCircle: {
    width: 24,
    height: 24,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E5EAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dtstTrainTaskCircleDone: { borderColor: '#FFBF31' },
  dtstTrainTaskText: { color: '#FFFFFF', flex: 1 },
  dtstTrainTaskTextDone: {
    color: '#FFBF31',
    textDecorationLine: 'line-through',
  },
});

export default Bestcoachtrainpl;
