# دليل أوامر PM2 للتحكم في السيرفر

## عرض حالة السيرفر
```bash
pm2 status
# أو
pm2 list
```

## إيقاف السيرفر
```bash
pm2 stop db-server
```

## تشغيل السيرفر
```bash
pm2 start db-server
# أو
pm2 start ecosystem.config.cjs
```

## إعادة تشغيل السيرفر
```bash
pm2 restart db-server
```

## عرض الـ logs
```bash
pm2 logs db-server
```

## عرض معلومات تفصيلية
```bash
pm2 show db-server
```

## حذف السيرفر من PM2
```bash
pm2 delete db-server
```

## حفظ التكوين الحالي
```bash
pm2 save
```

## مسح الـ logs
```bash
pm2 flush
```

## مراقبة السيرفر (real-time)
```bash
pm2 monit
```

---

## إلغاء التشغيل التلقائي
إذا أردت إيقاف التشغيل التلقائي للسيرفر عند بدء Windows:
```bash
pm2-startup uninstall
```

## إعادة تفعيل التشغيل التلقائي
```bash
pm2-startup install
pm2 save
```
