import { View } from '@gluestack-ui/themed';
import Toast from './toast';
import { useToaster } from 'react-hot-toast/headless'

function Notifications() {
  const { toasts, handlers } = useToaster();
  // const { startPause, endPause } = handlers;
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 30,
        right: 30,
      }}>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          t={t}
          updateHeight={(height) => handlers.updateHeight(t.id, height)}
          offset={handlers.calculateOffset(t, {
            reverseOrder: false,
          })}
        />
      ))}
    </View>
  );
};

export default Notifications