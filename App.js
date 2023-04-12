import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { ScrollView, StyleSheet, Text, View, Modal, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter'

import supabase from './src/lib/supabase'

export default function App() {
   const [list, setList] = useState([])
   const [isModalOpen, setIsModalOpen] = useState(false)
   let [fontsLoaded] = useFonts({
      Inter_400Regular,
      Inter_500Medium,
      Inter_600SemiBold,
      SpaceMono_Regular: require('./assets/fonts/SpaceMono-Regular.ttf'),
      PlayfairDisplay_SemiBold: require('./assets/fonts/PlayfairDisplay-SemiBold.ttf'),
   })

   useEffect(() => {
      ;(async () => {
         let { data: transactions, error } = await supabase
            .from('transactions')
            .select('*')
            .limit(10)
            .order('date', { ascending: false })
            .order('title', { ascending: true })
         setList(transactions)
      })()
   }, [])

   if (!fontsLoaded) {
      return null
   }
   return (
      <SafeAreaView>
         <ScrollView>
            <View style={styles.container}>
               <Text style={styles.pageHeading}>Your{'\n'}Transactions</Text>
               <View style={{ padding: 16, paddingTop: 0, paddingBottom: 52 }}>
                  {list.map(item => (
                     <Item key={item.id} item={item} />
                  ))}
               </View>
               <View style={{ height: 16 }} />
            </View>
         </ScrollView>
         <StatusBar style="auto" />
         <Modal
            transparent={true}
            visible={isModalOpen}
            onRequestClose={() => {
               setIsModalOpen(!isModalOpen)
            }}
         >
            <View style={styles.centeredView}>
               <View style={styles.modalView}>
                  <Text style={styles.modalText}>Hello World!</Text>
                  <Pressable onPress={() => setIsModalOpen(!isModalOpen)}>
                     <Text>Hide Modal</Text>
                  </Pressable>
               </View>
            </View>
         </Modal>
         <Pressable style={styles.floating.button} onPress={() => setIsModalOpen(true)}>
            <Text style={styles.floating.label}>Add</Text>
         </Pressable>
      </SafeAreaView>
   )
}

const format = {
   date: value =>
      new Intl.DateTimeFormat('en-US', {
         month: 'short',
         day: '2-digit',
         year: 'numeric',
      }).format(new Date(value)),
   amount: value =>
      new Intl.NumberFormat('en-IN', {
         style: 'currency',
         currency: 'INR',
      }).format(value / 100),
}

const Item = ({ item }) => {
   const isExpense = item.type === 'expense'
   return (
      <View style={styles.item}>
         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text numberOfLines={1} style={styles.title}>
               {item.title}
            </Text>
            <Text style={styles.amount}>
               {isExpense ? '-' : '+'}
               {format.amount(item.amount)}
            </Text>
         </View>
         <View style={{ marginTop: 12, gap: 8 }}>
            <View style={styles.section.item}>
               <Text style={styles.section.label}>Date</Text>
               <Text style={styles.section.value}>{format.date(item.date)}</Text>
            </View>
            <View style={styles.section.item}>
               <Text style={styles.section.label}>Category</Text>
               <Text style={styles.section.value}>{item.category}</Text>
            </View>
            <View style={styles.section.item}>
               <Text style={styles.section.label}>Payment Method</Text>
               <Text style={styles.section.value}>{item.payment_method}</Text>
            </View>
            <View style={styles.section.item}>
               <Text style={styles.section.label}>Account</Text>
               <Text style={styles.section.value}>{item.account}</Text>
            </View>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      height: '100%',
      backgroundColor: '#242424',
   },
   pageHeading: {
      padding: 16,
      fontSize: 42,
      color: '#fff',
      fontFamily: 'PlayfairDisplay_SemiBold',
   },
   item: {
      padding: 16,
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 16,
      borderStyle: 'solid',
      borderColor: '#4d4d4d',
      justifyContent: 'center',
   },
   title: {
      flex: 1,
      color: '#fff',
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
   },
   amount: {
      fontSize: 24,
      color: '#fff',
      fontFamily: 'SpaceMono_Regular',
   },
   section: {
      item: { flexDirection: 'row', justifyContent: 'space-between' },
      label: { color: '#616161', fontFamily: 'Inter_400Regular', fontSize: 16 },
      value: { opacity: 0.6, color: '#fff', fontFamily: 'Inter_400Regular', fontSize: 16 },
   },
   floating: {
      button: {
         height: 60,
         width: 100,
         borderRadius: 30,
         position: 'absolute',
         bottom: 12,
         right: 12,
         backgroundColor: '#22c55e',
         alignItems: 'center',
         justifyContent: 'center',
      },
      label: {
         color: '#fff',
         fontSize: 20,
      },
   },
   modalView: {
      height: '100%',
      backgroundColor: '#282828',
   },
   textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
   },
})
