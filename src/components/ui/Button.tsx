import { Button as PaperButton, ButtonProps, withTheme } from 'react-native-paper';

interface Props extends ButtonProps {}

const Button = (props: Props) => {
  return <PaperButton {...props} />;
};

export default withTheme(Button);
