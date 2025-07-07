import { useTranslation } from 'react-i18next';
import { MenuItem, Select, Typography, Box } from '@mui/material';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography>{t('select_language')}:</Typography>
      <Select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        size="small"
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="am">አማርኛ</MenuItem>
      </Select>
    </Box>
  );
};

export default LanguageSwitcher;
