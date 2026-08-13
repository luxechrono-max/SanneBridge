(function(n,t){"use strict";const s="https://sannewalid.aitnobajansen.workers.dev";async function l(){const e=await fetch(`${s}/bridge/sanne`,{cache:"no-store",headers:{Accept:"application/json"}});if(!e.ok)throw new Error(`Bridge HTTP ${e.status}`);const a=await e.json(),i=Array.isArray(a?.clips)?a.clips.filter(r=>r?.voice==="Sanne"):[];if(!i.length)throw new Error("No Sanne clips found");return i.reduce((r,c)=>new Date(c.createdAt).getTime()>new Date(r.createdAt).getTime()?c:r)}var o=()=>React.createElement(t.ReactNative.ScrollView,null,React.createElement(t.ReactNative.View,{style:{padding:16}},React.createElement(t.ReactNative.Text,{style:{color:"white",fontSize:22,fontWeight:"800",marginBottom:20}},"SanneBridge"),React.createElement(t.ReactNative.TouchableOpacity,{onPress:async()=>{try{const e=globalThis.__SanneGetLatest;if(!e)throw new Error("SanneBridge API unavailable");const a=await e();t.ReactNative.Alert.alert("Latest Sanne",`Timestamp:
${a.createdAt}

Clip ID:
${a.id}

URL:
${a.url}`)}catch(e){t.ReactNative.Alert.alert("SanneBridge Error",String(e?.message||e))}},style:{padding:16,borderRadius:8,backgroundColor:"#5865f2"}},React.createElement(t.ReactNative.Text,{style:{color:"white",textAlign:"center",fontWeight:"700"}},"FETCH LATEST SANNE"))));const d=()=>{globalThis.__SanneGetLatest=l},g=()=>{delete globalThis.__SanneGetLatest};return n.onLoad=d,n.onUnload=g,n.settings=o,n})({},vendetta.metro.common);
