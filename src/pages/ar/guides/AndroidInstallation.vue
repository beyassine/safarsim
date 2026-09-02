<template>
  <main class="guide-page" dir="rtl">
    <v-container class="guide-container">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <router-link to="/ar/">الرئيسية</router-link><v-icon size="16">mdi-chevron-left</v-icon>
        <span>أدلة eSIM</span><v-icon size="16">mdi-chevron-left</v-icon><strong>أندرويد</strong>
      </nav>
      <header class="guide-hero">
        <div class="guide-device-icon"><v-icon>mdi-android</v-icon></div><span>دليل تثبيت eSIM</span>
        <h1>كيفية تثبيت eSIM على أندرويد</h1>
        <p>اتبع هذه الخطوات لتثبيت شريحة SafarSIM قبل السفر وتفعيلها بعد الوصول إلى وجهتك.</p>
        <div class="guide-meta"><span><v-icon size="19">mdi-clock-outline</v-icon>حوالي 5 دقائق</span><span><v-icon size="19">mdi-wifi</v-icon>يفضل الاتصال بشبكة Wi-Fi</span></div>
      </header>
      <section class="guide-before"><h2>قبل البدء</h2><div class="before-grid">
        <div><v-icon>mdi-check-circle</v-icon><span>تأكد من أن هاتفك يدعم eSIM.</span></div>
        <div><v-icon>mdi-check-circle</v-icon><span>اتصل بشبكة Wi-Fi مستقرة.</span></div>
        <div><v-icon>mdi-check-circle</v-icon><span>افتح رسالة رمز QR على شاشة أخرى.</span></div>
        <div><v-icon>mdi-check-circle</v-icon><span>انتظر حتى الوصول قبل تشغيل بيانات الشريحة الجديدة.</span></div>
      </div></section>
      <section class="guide-steps">
        <div class="guide-section-heading"><span>التثبيت</span><h2>تثبيت eSIM على هاتف أندرويد</h2></div>
        <article class="guide-step"><div class="step-number">1</div><div><h3>افتح الإعدادات</h3><p>انتقل إلى الإعدادات ثم الاتصالات أو الشبكة والإنترنت أو شرائح SIM.</p></div></article>
        <article class="guide-step"><div class="step-number">2</div><div><h3>أضف eSIM</h3><p>اضغط إضافة eSIM أو إضافة باقة هاتف أو تنزيل شريحة SIM.</p></div></article>
        <article class="guide-step"><div class="step-number">3</div><div><h3>امسح رمز QR</h3><p>اختر رمز QR وامسح الرمز المرسل عبر البريد ثم أكد التنزيل.</p></div></article>
        <article class="guide-step"><div class="step-number">4</div><div><h3>سمّ الباقة</h3><p>أعد تسمية الشريحة «SafarSIM سفر» لتمييزها بسهولة.</p></div></article>
        <article class="guide-step"><div class="step-number">5</div><div><h3>اختر بيانات الهاتف</h3><p>بعد الوصول اختر SafarSIM لاستخدام بيانات الهاتف.</p></div></article>
        <article class="guide-step"><div class="step-number">6</div><div><h3>فعّل تجوال البيانات</h3><p>افتح إعدادات SafarSIM وفعّل التجوال للاتصال.</p></div></article>
      </section>
      <section class="guide-activation"><v-icon>mdi-access-point-network</v-icon><div><h2>بعد الوصول</h2><p>شغّل خط SafarSIM واختره للبيانات واترك اختيار الشبكة تلقائياً. قد يستغرق الاتصال بضع دقائق.</p></div></section>
      <section class="guide-help"><h2>هل تحتاج إلى مساعدة؟</h2><p>أعد تشغيل الهاتف وتأكد من تشغيل بيانات الهاتف والتجوال لخط SafarSIM.</p><div><router-link to="/ar/guides/compatibility">تحقق من التوافق</router-link><router-link to="/ar/contact">تواصل مع الدعم</router-link></div></section>
    </v-container>
  </main>
</template>
<style src="../../../assets/styles/installation-guide.css"></style>
