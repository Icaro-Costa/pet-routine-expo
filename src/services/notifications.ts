import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type PetNotificationCallback = (petId: string) => void;

function petIdFromData(data: unknown): string | null {
  if (
    typeof data === 'object' &&
    data !== null &&
    'petId' in data &&
    typeof data.petId === 'string'
  ) {
    return data.petId;
  }

  return null;
}

async function requestNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

async function configureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync('passeios', {
    name: 'Lembretes de passeio',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 160, 250],
    lightColor: '#35E9FF',
  });
}

export async function agendarLembretePasseio(petId: string, nomePet: string): Promise<string> {
  await configureAndroidChannel();
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    throw new Error('Permita notificações nas configurações para receber lembretes de passeio.');
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: `Hora do passeio de ${nomePet}! 🐾`,
      body: 'Toque para abrir os detalhes e registrar o passeio.',
      data: { petId },
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      channelId: 'passeios',
      repeats: false,
    },
  });
}

/** Registers both foreground and interaction listeners and returns their required cleanup. */
export function configurarNotificacoes(
  aoAbrirPet: PetNotificationCallback,
  aoReceber?: PetNotificationCallback
) {
  const receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
    const petId = petIdFromData(notification.request.content.data);
    if (petId) {
      aoReceber?.(petId);
    }
  });

  const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const petId = petIdFromData(response.notification.request.content.data);
    if (petId) {
      aoAbrirPet(petId);
    }
  });

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}
