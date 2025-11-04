# Full Stack Hercafe Showcase Website - Production Repo

<br>[![Status](https://img.shields.io/badge/status-live-green.svg)](https://saccaria.ba)  ![REST API](https://img.shields.io/badge/REST_API-FF6C37?style=flat&logo=json&logoColor=white)  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
<br>

A full-stack web application for showcasing coffee brand products for a local coffee distribution company. The app enables the client to manage product information through a secure dashboard while giving customers an interactive and memorable browsing experience with the use of ThreeJS.

## Overview

This application serves as a dynamic product catalog for a local company. It allows real-time content updates through an admin dashboard, ensuring product information is always current. 
The system is used internally by company employees for content management and externally by customers interested in viewing the product lineup. The site features custom interactive 3D product models implemented with ThreeJS, allowing customers to examine each product from every angle.

**Live Site**: https://www.saccaria.ba/

## Features

### Content Management
- **REST API**: Complete CRUD operations for product management
- **Admin Dashboard**: Secure interface for updating products, descriptions, pricing, and attributes
- **Dynamic Catalog**: Real-time product data from MongoDB

### User System
- Secure user login
- Role-based authentication and authorization
- Protected admin routes and API endpoints

### Frontend Experience
- **3D Product Visualization**: Custom Made Interactive ThreeJS models
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Performance**: Redis-based rate limiting 

## Technologies used
 **Frontend:** HTML5, CSS, JavaScript, ThreeJS <br>
 ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
  ![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat&logo=threedotjs&logoColor=white)
  
 **Backend:** Node.js, Express.js <br>
 ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
  
 **Database:** MongoDB, Mongoose <br>
 ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
 
 **Rate Limitting:** Redis <br>
   ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)

 **Hosting:** Render.com <br>
   ![Render](https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render&logoColor=white)


## Deployment

The application is automatically deployed on Render using continuous deployment.

## Project Structure
```
root/
│
├── backend/
│ ├── config/ # Configuration files
│ ├── controllers/ # Route controllers
│ ├── middleware/ # Custom middleware (authentication, validation)
│ ├── models/ # Mongoose models (User, Product)
│ ├── routes/ # Express routes (auth, products, admin)
│ ├── server.js # Main server entry point
│ ├── package.json
│ └── package-lock.json
│
└── frontend/
├── css/ # Stylesheets
├── js/ # Client-side JavaScript
├── dashboard/ # Admin dashboard pages
├── images/ # Static images
├── models/ # 3D models and textures
├── 404.html # Error page
├── index.html # Homepage
├── product pages/ # Individual product pages
│ ├── detergent.html
│ ├── espresso.html
│ ├── intenso.html
│ ├── robusto.html
│ └── shine.html
├── contact.html # Contact page
├── sign_in.html # Authentication page
│
├── .gitignore
└── README.md
```
This structure separates the backend API from the frontend client. The frontend includes dedicated pages for each product and a separate dashboard section for admin management.

## Status
**Live**: The application is currently in use and serving traffic.
