<Modal
         visible={true}
         animationType="slide"
         transparent={true}
       >
         <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)" }}>
           <Pressable style={{ flex: 1 }}></Pressable>
           <View style={{ height: 200, backgroundColor: "#fcfbff", borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
             <View style={{ alignItems: 'flex-end', margin: 10 }}>
               <TouchableOpacity onPress={closeModal}>
                 <FontAwesomeIcon
                   icon={faXmark}
                   size={24}
                   color='#787A8D'
                 />
               </TouchableOpacity>
             </View>
             <View>

               <View style={{ alignItems: 'center', marginBottom: 10 }}>
                 <Text>Are you sure you want to log out</Text>
               </View>
               <View style={{
                 alignItems: 'center', marginTop: 20, margin: 15, padding: 0,
                 borderRadius: 8
               }}>
                 <TouchableOpacity onPress={() => { closeModal(); logout() }} style={{
                   backgroundColor: '#de4040', width: '100%', alignItems: 'center', padding: 10, borderRadius: 8
                 }}>
                   <Text style={{ color: 'white', fontWeight: 'bold' }}>Yes</Text>
                 </TouchableOpacity>
               </View>
             </View>
           </View>
         </View>
       </Modal>