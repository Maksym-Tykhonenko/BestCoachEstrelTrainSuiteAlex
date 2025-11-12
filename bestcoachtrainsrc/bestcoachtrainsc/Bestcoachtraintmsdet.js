import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Bestcoachtrainlay from '../bestcoachtraincmp/Bestcoachtrainlay';
import { useStore } from '../bestcoachtrainst/bestCoachTrainContext';
import { BlurView } from '@react-native-community/blur';
import Toast from 'react-native-toast-message';

const { height, width } = Dimensions.get('window');

const Bestcoachtraintmsdet = () => {
  const route = useRoute();
  const { team } = route.params;
  const { updateTeamPlayers, bestTrainNotificationsEnabled } = useStore();
  const navigation = useNavigation();
  const [bestTrainPlayers, setBestTrainPlayers] = useState(
    team.playersList || [],
  );
  const [bestTrainModalVisible, setBestTrainModalVisible] = useState(false);
  const [bestTrainDeleteModalVisible, setBestTrainDeleteModalVisible] =
    useState(false);
  const [bestTrainPlayerToDelete, setBestTrainPlayerToDelete] = useState(null);
  const [bestTrainPlayerName, setBestTrainPlayerName] = useState('');
  const [bestTrainPlayerPosition, setBestTrainPlayerPosition] = useState('');
  const [bestTrainPlayerNotes, setBestTrainPlayerNotes] = useState('');

  const bestTrainHandleAddPlayer = () => {
    if (!bestTrainPlayerName.trim()) return;

    if (bestTrainNotificationsEnabled) {
      Toast.show({
        text1: 'New player added!',
      });
    }

    const newPlayer = {
      id: Date.now().toString(),
      name: bestTrainPlayerName.trim(),
      position: bestTrainPlayerPosition.trim(),
      notes: bestTrainPlayerNotes.trim(),
    };

    const updatedPlayers = [...bestTrainPlayers, newPlayer];
    setBestTrainPlayers(updatedPlayers);
    updateTeamPlayers(team.id, updatedPlayers);

    setBestTrainPlayerName('');
    setBestTrainPlayerPosition('');
    setBestTrainPlayerNotes('');
    setBestTrainModalVisible(false);
  };

  const bestTrainHandleDeletePlayer = () => {
    if (bestTrainNotificationsEnabled) {
      Toast.show({
        text1: 'Player removed successfully!',
      });
    }
    const updated = bestTrainPlayers.filter(
      p => p.id !== bestTrainPlayerToDelete.id,
    );
    setBestTrainPlayers(updated);
    updateTeamPlayers(team.id, updated);
    setBestTrainPlayerToDelete(null);
    setBestTrainDeleteModalVisible(false);
  };

  const bestTrainRenderPlayerCard = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onLongPress={() => {
        setBestTrainPlayerToDelete(item);
        setBestTrainDeleteModalVisible(true);
      }}
    >
      <View style={styles.besttrainPlayerCard}>
        <View style={styles.besttrainPlayerLeft}>
          <View style={styles.besttrainNumberCircle}>
            <Text style={styles.besttrainNumberText}>{index + 1}</Text>
          </View>
          <Text style={styles.besttrainPlayerName}>{item.name}</Text>
        </View>
        <View style={styles.besttrainPositionBtn}>
          <Text style={styles.besttrainPositionText}>{item.position}</Text>
        </View>
      </View>
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
        <TouchableOpacity
          style={styles.besttrainBackBtn}
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}
        >
          <Image source={require('../../assets/images/trainbackbtn.png')} />
          <Text style={styles.besttrainBackText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.besttrainTitle}>TEAM DETAILS</Text>

        <View style={styles.besttrainTeamCard}>
          <View style={styles.besttrainTeamHeader}>
            <View style={styles.besttrainTeamCnt}>
              <Text style={styles.besttrainTeamName}>{team.name}</Text>
            </View>
            <View style={styles.besttrainPlayerBadge}>
              <Text style={styles.besttrainPlayerText}>
                Players: {bestTrainPlayers.length}
              </Text>
            </View>
          </View>
          <Text style={styles.besttrainTeamSport}>{team.sport}</Text>
        </View>

        <FlatList
          data={bestTrainPlayers}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={bestTrainRenderPlayerCard}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Image source={require('../../assets/images/trainempt.png')} />
              <Text style={styles.besttrainEmptyText}>
                No players yet. Tap + to add your first team member
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

        {bestTrainPlayers.length !== 0 && (
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
              <Text style={styles.besttrainModalTitle}>ADD PLAYER</Text>

              <TextInput
                placeholder="Name"
                value={bestTrainPlayerName}
                onChangeText={setBestTrainPlayerName}
                placeholderTextColor="#FFFFFFB2"
                style={styles.besttrainModalInput}
              />

              <TextInput
                placeholder="Position"
                value={bestTrainPlayerPosition}
                onChangeText={setBestTrainPlayerPosition}
                placeholderTextColor="#FFFFFFB2"
                style={styles.besttrainModalInput}
              />

              <TextInput
                placeholder="Notes"
                value={bestTrainPlayerNotes}
                onChangeText={setBestTrainPlayerNotes}
                placeholderTextColor="#FFFFFFB2"
                style={styles.besttrainModalInput}
              />

              <TouchableOpacity
                style={[
                  styles.besttrainModalButton,
                  { marginTop: 20 },
                  { backgroundColor: '#FFBF31' },
                  (!bestTrainPlayerName ||
                    !bestTrainPlayerPosition ||
                    !bestTrainPlayerNotes) && {
                    backgroundColor: '#FFBF31B2',
                  },
                ]}
                onPress={bestTrainHandleAddPlayer}
                activeOpacity={0.8}
              >
                <Text style={styles.besttrainModalButtonText}>Save Player</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setBestTrainModalVisible(false),
                    setBestTrainPlayerName(''),
                    setBestTrainPlayerNotes(''),
                    setBestTrainPlayerPosition('');
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
              <Text style={styles.besttrainDeleteTitle}>Delete player?</Text>
              <Text style={styles.besttrainDeleteMessage}>
                Are you sure you want to delete this player?{'\n'}This action
                cannot be undone.
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
                  onPress={bestTrainHandleDeletePlayer}
                >
                  <Text style={styles.besttrainDeleteConfirmText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Bestcoachtrainlay>
  );
};

const styles = StyleSheet.create({
  besttrainContainer: {
    padding: 24,
    flex: 1,
    paddingTop: height * 0.08,
  },
  besttrainBackBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  besttrainBackText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '400',
  },
  besttrainTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  besttrainTeamCard: {
    backgroundColor: '#001B61',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  besttrainTeamCnt: {
    backgroundColor: '#000922',
    padding: 14,
    borderRadius: 16,
    flex: 2,
  },
  besttrainTeamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  besttrainTeamName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
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
  besttrainTeamSport: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 14,
  },
  besttrainEmptyText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 18,
    fontWeight: '500',
    width: width * 0.8,
  },
  besttrainPlayerCard: {
    flexDirection: 'row',
    backgroundColor: '#001B61',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
  },
  besttrainPlayerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  besttrainNumberCircle: {
    backgroundColor: '#000C2A',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  besttrainNumberText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  besttrainPlayerName: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  besttrainPositionBtn: {
    backgroundColor: '#0046FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minWidth: 100,
  },
  besttrainPositionText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  besttrainBlur: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
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
  besttrainModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000054',
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
    color: '#444',
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

export default Bestcoachtraintmsdet;
