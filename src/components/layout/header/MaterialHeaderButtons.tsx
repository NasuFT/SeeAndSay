import { HeaderButtons, HeaderButtonsProps } from 'react-navigation-header-buttons';
import MaterialHeaderButton from './MaterialHeaderButton';

const MaterialHeaderButtons = (props: HeaderButtonsProps) => {
  return <HeaderButtons HeaderButtonComponent={MaterialHeaderButton} {...props} />;
};

export default MaterialHeaderButtons;
