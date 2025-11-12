import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  Platform,
} from 'react-native';
import Bestcoachtrainlay from '../bestcoachtraincmp/Bestcoachtrainlay';
import { useStore } from '../bestcoachtrainst/bestCoachTrainContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import Toast from 'react-native-toast-message';
import Orientation from 'react-native-orientation-locker';

const { height } = Dimensions.get('window');

const bestTrainSportTypes = [
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

const Bestcoachtraintms = () => {
  const { teams, addTeam, deleteTeam, bestTrainNotificationsEnabled } =
    useStore();
  const [bestTrainModalVisible, setBestTrainModalVisible] = useState(false);
  const [bestTrainDeleteModalVisible, setBestTrainDeleteModalVisible] =
    useState(false);
  const [bestTrainDropdownVisible, setBestTrainDropdownVisible] =
    useState(false);
  const [bestTrainTeamToDelete, setBestTrainTeamToDelete] = useState(null);
  const [bestTrainTeamName, setBestTrainTeamName] = useState('');
  const [bestTrainSportType, setBestTrainSportType] = useState('');
  const [bestTrainSearchText, setBestTrainSearchText] = useState('');
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      Platform.OS === 'android' &&
        (bestTrainModalVisible || bestTrainDeleteModalVisible) &&
        Orientation.lockToPortrait();

      return () => Orientation.unlockAllOrientations();
    }, [bestTrainModalVisible, bestTrainDeleteModalVisible]),
  );

  const bestTrainHandleSaveTeam = () => {
    if (!bestTrainTeamName.trim() || !bestTrainSportType.trim()) return;
    if (bestTrainNotificationsEnabled) {
      Toast.show({
        text1: 'Team created successfully!',
      });
    }
    addTeam({
      name: bestTrainTeamName.trim(),
      sport: bestTrainSportType,
      players: 0,
      playersList: [],
    });
    setBestTrainTeamName('');
    setBestTrainSportType('');
    setBestTrainModalVisible(false);
  };

  const bestTrainFilteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(bestTrainSearchText.toLowerCase()),
  );

  const bestTrainHandleDeleteConfirm = () => {
    if (bestTrainTeamToDelete) {
      if (bestTrainNotificationsEnabled) {
        Toast.show({
          text1: 'Team deleted successfully!',
        });
      }
      deleteTeam(bestTrainTeamToDelete.id);
      setBestTrainTeamToDelete(null);
      setBestTrainDeleteModalVisible(false);
    }
  };

  const bestTrainRenderTeamCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('Bestcoachtraintmsdet', { team: item })
      }
      onLongPress={() => {
        setBestTrainTeamToDelete(item);
        setBestTrainDeleteModalVisible(true);
      }}
      style={styles.besttrainTeamCard}
    >
      <View style={styles.besttrainTeamHeader}>
        <View style={styles.besttrainTeamCnt}>
          <Text style={styles.besttrainTeamName}>{item.name}</Text>
        </View>

        <View style={styles.besttrainPlayerBadge}>
          <Text style={styles.besttrainPlayerText}>
            Players: {item.players}
          </Text>
        </View>
      </View>
      <Text style={styles.besttrainTeamSport}>{item.sport}</Text>
    </TouchableOpacity>
  );

  return (
    <Bestcoachtrainlay>
      <View
        style={[
          styles.besttrainContainer,
          (bestTrainModalVisible || bestTrainDeleteModalVisible) &&
            Platform.OS === 'android' && { filter: 'blur(2px)' },
        ]}
      >
        <Text style={styles.besttrainTitle}>TEAMS</Text>

        <View style={{ width: '100%' }}>
          <TextInput
            placeholder="Search ..."
            value={bestTrainSearchText}
            onChangeText={setBestTrainSearchText}
            style={styles.besttrainInput}
            placeholderTextColor={'#FFFFFFB2'}
          />
          <Image
            source={require('../../assets/images/trainsearch.png')}
            style={styles.besttrainInputIcon}
          />
        </View>

        <FlatList
          data={bestTrainFilteredTeams}
          keyExtractor={item => item.id}
          renderItem={bestTrainRenderTeamCard}
          scrollEnabled={false}
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Image source={require('../../assets/images/trainempt.png')} />
              <Text style={styles.besttrainEmptyText}>
                No teams yet. Tap + to add your team
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.besttrainAddButtonEmpt}
                onPress={() => setBestTrainModalVisible(true)}
              >
                <Image source={require('../../assets/images/trainadd.png')} />
              </TouchableOpacity>
            </View>
          }
        />
      </View>

      {bestTrainFilteredTeams.length !== 0 && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.besttrainAddButton}
          onPress={() => setBestTrainModalVisible(true)}
        >
          <Image source={require('../../assets/images/trainadd.png')} />
        </TouchableOpacity>
      )}

      <Modal transparent animationType="fade" visible={bestTrainModalVisible}>
        {Platform.OS === 'ios' && (
          <BlurView
            style={styles.besttrainBlur}
            blurType="dark"
            blurAmount={4}
          />
        )}
        <View style={styles.besttrainModalOverlay}>
          <View style={styles.besttrainModalContainer}>
            <Text style={styles.besttrainModalTitle}>CREATE TEAM</Text>

            <TextInput
              placeholder="Team name"
              value={bestTrainTeamName}
              onChangeText={setBestTrainTeamName}
              placeholderTextColor="#FFFFFFB2"
              style={styles.besttrainModalInput}
            />

            <View style={{ width: '100%', position: 'relative' }}>
              <TouchableOpacity
                style={[
                  styles.besttrainModalSelect,
                  bestTrainDropdownVisible && {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  setBestTrainDropdownVisible(!bestTrainDropdownVisible)
                }
              >
                <Text style={styles.besttrainModalSelectText}>
                  {bestTrainSportType || 'Select sport type'}
                </Text>
                <Image
                  source={require('../../assets/images/traindropdown.png')}
                  style={{ tintColor: '#FFFFFFB2', width: 18, height: 18 }}
                />
              </TouchableOpacity>

              {bestTrainDropdownVisible && (
                <View style={styles.besttrainDropdownList}>
                  <ScrollView style={{ maxHeight: 200 }}>
                    {bestTrainSportTypes.map((sport, i) => (
                      <TouchableOpacity
                        key={i}
                        style={[
                          styles.besttrainDropdownItem,
                          bestTrainSportType === sport && {
                            backgroundColor: '#002C8A',
                          },
                        ]}
                        onPress={() => {
                          setBestTrainSportType(sport);
                          setBestTrainDropdownVisible(false);
                        }}
                      >
                        <Text style={styles.besttrainDropdownItemText}>
                          {sport}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.besttrainModalButton,
                { marginTop: 20 },
                { backgroundColor: '#FFBF31' },
                (!bestTrainTeamName || !bestTrainSportType) && {
                  backgroundColor: '#FFBF31B2',
                },
              ]}
              onPress={bestTrainHandleSaveTeam}
              activeOpacity={0.8}
            >
              <Text style={styles.besttrainModalButtonText}>Save Team</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setBestTrainModalVisible(false),
                  setBestTrainTeamName(''),
                  setBestTrainSportType('');
              }}
            >
              <Text style={styles.besttrainModalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={bestTrainDeleteModalVisible}
      >
        {Platform.OS === 'ios' && (
          <BlurView
            style={styles.besttrainBlur}
            blurType="dark"
            blurAmount={4}
          />
        )}
        <View style={styles.besttrainDeleteOverlay}>
          <View style={styles.besttrainDeleteBox}>
            <Text style={styles.besttrainDeleteTitle}>Delete team?</Text>
            <Text style={styles.besttrainDeleteMessage}>
              Are you sure you want to delete this team?{'\n'}This action cannot
              be undone.
            </Text>

            <View style={styles.besttrainDeleteButtons}>
              <TouchableOpacity
                style={styles.besttrainDeleteCancelBtn}
                onPress={() => setBestTrainDeleteModalVisible(false)}
              >
                <Text style={styles.besttrainDeleteCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.besttrainDeleteConfirmBtn}
                onPress={bestTrainHandleDeleteConfirm}
              >
                <Text style={styles.besttrainDeleteConfirmText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Bestcoachtrainlay>
  );
};

const styles = StyleSheet.create({
  besttrainContainer: {
    padding: 24,
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.08,
  },
  besttrainTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  besttrainInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#001B61',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingLeft: 45,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 24,
  },
  besttrainInputIcon: {
    position: 'absolute',
    top: 15,
    left: 15,
    tintColor: '#FFFFFFB2',
  },
  besttrainTeamCnt: {
    backgroundColor: '#000922',
    padding: 14,
    borderRadius: 16,
    flex: 2,
  },
  besttrainAddButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFBF31',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 140,
    right: 24,
  },
  besttrainAddButtonEmpt: {
    width: 48,
    height: 48,
    backgroundColor: '#FFBF31',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  besttrainTeamCard: {
    backgroundColor: '#001B61',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  besttrainTeamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  besttrainBlur: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  besttrainTeamName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  besttrainTeamSport: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 14,
  },
  besttrainPlayerBadge: {
    backgroundColor: '#FFBF31',
    padding: 14,
    borderRadius: 16,
  },
  besttrainPlayerText: {
    color: '#000922',
    fontWeight: '600',
  },
  besttrainEmptyText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 60,
    fontSize: 20,
    fontWeight: '500',
  },
  besttrainModalOverlay: {
    flex: 1,
    backgroundColor: '#00000054',
    justifyContent: 'center',
    alignItems: 'center',
  },
  besttrainModalContainer: {
    width: '85%',
    backgroundColor: '#001B61',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  besttrainModalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  besttrainModalInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#000922',
    borderRadius: 10,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
  },
  besttrainModalSelect: {
    width: '100%',
    height: 50,
    backgroundColor: '#000922',
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  besttrainModalSelectText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  besttrainDropdownList: {
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
  besttrainDropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  besttrainDropdownItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  besttrainModalButton: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  besttrainModalButtonText: {
    color: '#000922',
    fontSize: 16,
    fontWeight: '600',
  },
  besttrainModalCancel: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  besttrainDeleteOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  besttrainDeleteBox: {
    width: '80%',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  besttrainDeleteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  besttrainDeleteMessage: {
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  besttrainDeleteButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  besttrainDeleteCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    borderRightWidth: 1,
  },
  besttrainDeleteConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  besttrainDeleteCancelText: {
    fontWeight: '600',
    color: '#000',
  },
  besttrainDeleteConfirmText: {
    fontWeight: '600',
    color: '#E53935',
  },
});

export default Bestcoachtraintms;
