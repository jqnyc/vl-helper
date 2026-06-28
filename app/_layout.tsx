import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="post/[id]"
          options={{
            title: 'Edit Post',
            headerBackTitle: 'Posts',
            headerStyle: { backgroundColor: '#fff' },
            headerTintColor: '#111',
          }}
        />
        <Stack.Screen
          name="new"
          options={{
            title: 'New Post',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#fff' },
            headerTintColor: '#111',
          }}
        />
        <Stack.Screen
          name="template/[id]"
          options={{
            title: 'Edit Template',
            headerBackTitle: 'Topics',
            headerStyle: { backgroundColor: '#fff' },
            headerTintColor: '#111',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
