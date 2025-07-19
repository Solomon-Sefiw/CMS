import { useTranslation } from 'react-i18next';
import { MenuItem, Select, Typography, Box } from '@mui/material';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  return (
    <Box display="flex" alignItems="center" gap={1} sx={{color : "white"}}>
      {/* <Typography>{t('select_language')}:</Typography> */}
      <Select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        size="small"
        sx={{color : "white"}}
      >
        <MenuItem value="en" selected>English</MenuItem>
        <MenuItem value="am">አማርኛ</MenuItem>
      </Select>
    </Box>
  );
};

export default LanguageSwitcher;
