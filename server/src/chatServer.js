import express from 'express'
import http from 'http'
import cors from 'cors'
import {Server} from 'socket.io'



const app = express() ; 
const server = http.createServer(app) ; 
app.use(cors()) ; 

let admins = [] ; 
let waitingStudents = [] ; 


const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173" , 
        methods:['GET',"POST"]
    }
})

io.on("connection",(socket) => {
    //console.log(`User connected ${socket.id}}`);
    
    socket.on('registerAdmin', (name) => {
        socket.name = name ; 
        admins.push(socket);
        console.log('Admin registered:', socket.id);
        if (waitingStudents.length > 0) {
          const student = waitingStudents.shift();
          assignAdminToStudent(socket, student);
        }
      });

      socket.on('registerStudent', (name) => {
        socket.name = name ; 
        const availableAdmin = admins.find(admin => !admin.busy);
        console.log('Student registered ',socket.id);
        if (availableAdmin) {
          assignAdminToStudent(availableAdmin, socket);
        } else {
          waitingStudents.push(socket);
          socket.emit('waitForAdmin', 'Please wait, all admins are currently busy.');
        }
      });

      socket.on('disconnect', () => {
        admins = admins.filter(admin => admin !== socket);
        waitingStudents = waitingStudents.filter(student => student !== socket);
        console.log('User disconnected:', socket.id);
      });


      socket.on('sendImageMessage',({recipientId,image,message}) => {
        console.log('Image msg ');
        console.log(recipientId);
        io.to(recipientId).emit('receiveImageMessage',{senderId:socket.id , image: image ,message: message}) ;

      })

      socket.on('image',({ recipientId, image}) => {
        console.log('Image');
        console.log(recipientId);
        console.log(socket.id);
        io.to(recipientId).emit('receiveImage',{senderId:socket.id , image: image}) ; 
      })
      
      socket.on('message',({ recipientId, message}) => {
        console.log('Message ', message , ' for' , recipientId);
        io.to(recipientId).emit('receiveMessage',{senderId:socket.id , message: message}) ; 
      })
      
      socket.on('Disconnecting',({recipientId}) => {
        console.log('Disc ',recipientId);
        io.to(recipientId).emit('Disconnecting') ; 
        admins = admins.filter(admin => admin !== socket);
        waitingStudents = waitingStudents.filter(student => student !== socket);
      })

})

function assignAdminToStudent(admin, student) {
    admin.busy = true;
    admin.studentId = student.id;
    student.adminId = admin.id;
  
    admin.emit('studentConnected', {id:student.id , studentName: student.name});
    student.emit('adminConnected', {id: admin.id , adminName: admin.name});
  
    console.log(`Assigned admin ${admin.id} to student ${student.id}`);
  }


server.listen(3001,() => {
    console.log('Server running at 3001');
})