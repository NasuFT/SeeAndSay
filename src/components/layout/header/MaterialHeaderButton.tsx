import { HeaderButton, HeaderButtonProps } from 'react-navigation-header-buttons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MaterialHeaderButton = (props: HeaderButtonProps) => {
  return <HeaderButton IconComponent={MaterialCommunityIcons} iconSize={24} {...props} />;
};

export default MaterialHeaderButton;
