import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    useTheme,
    Paper,
    Divider,
    Slider,
    Button,
    ButtonGroup,
    IconButton,
    Tooltip
} from '@mui/material';
import { useAppTheme } from '../contexts/ThemeContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const presets = [
    {
        id: 'light',
        name: 'Azure Breeze',
        description: 'Professional, clean, and modern light theme.',
        preview: ['#1d4ed8', '#f8fafc', '#ffffff'],
        arabicName: 'نسيم البحر'
    },
    {
        id: 'dark',
        name: 'Midnight Silk',
        description: 'Premium dark mode with golden accents.',
        preview: ['#fbbf24', '#0f172a', '#1e293b'],
        arabicName: 'الحرير الليلي'
    },
    {
        id: 'emerald',
        name: 'Emerald Forest',
        description: 'Refreshing and professional green-based theme.',
        preview: ['#059669', '#f0fdf4', '#ffffff'],
        arabicName: 'الغابة الزمردية'
    },
    {
        id: 'royal',
        name: 'Royal Purple',
        description: 'Elegant and sophisticated violet palette.',
        preview: ['#7c3aed', '#f5f3ff', '#ffffff'],
        arabicName: 'الأرجوان الملكي'
    }
];

const CUSTOM_COLORS = [
    '#1d4ed8', '#059669', '#7c3aed', '#db2777', '#f59e0b', '#dc2626', '#0891b2', '#4f46e5'
];

const FONTS = ['Tajawal', 'Almarai', 'Inter', 'Roboto'];

export default function ThemeSettingsPage() {
    const {
        themeName,
        primaryColor,
        borderRadius,
        fontFamily,
        updateConfig,
        resetConfig
    } = useAppTheme();
    const theme = useTheme();

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    إعدادات المظهر
                </Typography>
                <Button
                    startIcon={<RestartAltIcon />}
                    variant="outlined"
                    onClick={resetConfig}
                    sx={{ borderRadius: 10 }}
                >
                    استعادة الافتراضي
                </Button>
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                خصص واجهة النظام لتناسب أسلوب عملك الخاص.
            </Typography>

            <Divider sx={{ mb: 4 }} />

            {/* Presets Section */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                الأنماط الجاهزة
            </Typography>
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {presets.map((t) => (
                    <Grid item xs={12} sm={6} md={3} key={t.id}>
                        <Card
                            sx={{
                                position: 'relative',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                border: themeName === t.id && !primaryColor ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent',
                                transform: themeName === t.id && !primaryColor ? 'scale(1.02)' : 'scale(1)',
                            }}
                        >
                            <CardActionArea onClick={() => updateConfig({ themeName: t.id, primaryColor: null })} sx={{ height: '100%' }}>
                                <Box sx={{ height: 80, background: t.preview[1], p: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                    <Box sx={{ width: '40%', height: 4, borderRadius: 2, background: t.preview[0] }} />
                                    <Box sx={{ width: '60%', height: 4, borderRadius: 2, background: t.preview[2], opacity: 0.3 }} />
                                </Box>
                                <CardContent sx={{ p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                            {t.arabicName}
                                        </Typography>
                                        {themeName === t.id && !primaryColor && <CheckCircleIcon color="primary" fontSize="small" />}
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Divider sx={{ mb: 6 }} />

            <Grid container spacing={6}>
                {/* Custom Color Section */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                        لون العلامة التجارية (Primary)
                    </Typography>
                    <Grid container spacing={1}>
                        {CUSTOM_COLORS.map((color) => (
                            <Grid item key={color}>
                                <IconButton
                                    onClick={() => updateConfig({ primaryColor: color })}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        bgcolor: color,
                                        border: primaryColor === color ? '4px solid white' : 'none',
                                        boxShadow: primaryColor === color ? `0 0 0 2px ${color}` : 'none',
                                        '&:hover': { bgcolor: color, opacity: 0.9 }
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* Border Radius Section */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        حدة الحواف (Border Radius)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        تحكم في استدارة حواف البطاقات والأزرار والحقول.
                    </Typography>
                    <Box sx={{ px: 2 }}>
                        <Slider
                            value={borderRadius}
                            min={0}
                            max={24}
                            onChange={(e, val) => updateConfig({ borderRadius: val })}
                            valueLabelDisplay="auto"
                            marks={[
                                { value: 0, label: 'حادة' },
                                { value: 12, label: 'متوسطة' },
                                { value: 24, label: 'دائرية' }
                            ]}
                        />
                    </Box>
                </Grid>

                {/* Font Family Section */}
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                        نوع الخط (Typography)
                    </Typography>
                    <ButtonGroup variant="outlined" size="large" sx={{ borderRadius: 10 }}>
                        {FONTS.map((font) => (
                            <Button
                                key={font}
                                onClick={() => updateConfig({ fontFamily: font })}
                                sx={{
                                    fontFamily: font,
                                    fontWeight: fontFamily === font ? 800 : 400,
                                    bgcolor: fontFamily === font ? 'primary.light' : 'transparent',
                                    color: fontFamily === font ? 'primary.contrastText' : 'inherit',
                                    minWidth: 120
                                }}
                            >
                                {font}
                            </Button>
                        ))}
                    </ButtonGroup>
                </Grid>
            </Grid>

            {/* Preview Section */}
            <Box sx={{ mt: 8 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    معاينة التخصيص
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Button variant="contained" fullWidth>زر أساسي</Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">بطاقة معاينة</Typography>
                                <Typography variant="body2" color="text.secondary">هذا مثال لشكل البطاقة بعد التخصيص.</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                            إشعار نجاح
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
