
### 1. **Authentication & User Management**                            ------>     (DONE)
- **POST `/api/auth/register`**: Register a new user (student or instructor).
- **POST `/api/auth/login`**: Authenticate a user and return a JWT token.
- **POST `/api/auth/logout`**: Logout the user.
- **GET `/api/users/me`**: Get the authenticated user's profile.
- **PUT `/api/users/me`**: Update the authenticated user's profile.
- **POST `/api/auth/forgot-password`**: Initiate password reset.
- **POST `/api/auth/reset-password`**: Reset password using a token.

### 2. **Course Management**                                          ------>     (DONE)
- **POST `/api/courses`**: Create a new course (Instructor only).
- **GET `/api/courses`**: Get a list of all courses.
- **GET `/api/courses/:id`**: Get details of a specific course by ID.
- **PUT `/api/courses/:id`**: Update a course by ID (Instructor only).
- **DELETE `/api/courses/:id`**: Delete a course by ID (Instructor only).
- **GET `/api/courses/category/:category`**: Get courses by category.
- **GET `/api/courses/instructor/:instructorId`**: Get courses by instructor ID.

### 3. **Enrollment Management**                                     ------>     (DONE)
- **POST `/api/courses/:id/enroll`**: Enroll the authenticated user in a course.
- **GET `/api/courses/enrolled`**: Get a list of courses the authenticated user is enrolled in.
- **DELETE `/api/courses/:id/unenroll`**: Unenroll the authenticated user from a course.
- **GET `/api/courses/:id/students`**: Get a list of students enrolled in a specific course (Instructor only).

### 4. **Lesson/Content Management**
- **POST `/api/courses/:id/lessons`**: Add a new lesson to a course (Instructor only).
- **GET `/api/courses/:id/lessons`**: Get a list of all lessons in a course.
- **GET `/api/courses/:id/lessons/:lessonId`**: Get details of a specific lesson by ID.
- **PUT `/api/courses/:id/lessons/:lessonId`**: Update a lesson by ID (Instructor only).
- **DELETE `/api/courses/:id/lessons/:lessonId`**: Delete a lesson by ID (Instructor only).

### 5. **Quiz & Assessment Management**
- **POST `/api/courses/:id/quizzes`**: Add a new quiz to a course (Instructor only).
- **GET `/api/courses/:id/quizzes`**: Get a list of all quizzes in a course.
- **GET `/api/courses/:id/quizzes/:quizId`**: Get details of a specific quiz by ID.
- **PUT `/api/courses/:id/quizzes/:quizId`**: Update a quiz by ID (Instructor only).
- **DELETE `/api/courses/:id/quizzes/:quizId`**: Delete a quiz by ID (Instructor only).
- **POST `/api/courses/:id/quizzes/:quizId/submit`**: Submit a quiz for grading.
- **GET `/api/courses/:id/quizzes/:quizId/results`**: Get quiz results for the authenticated user.

### 6. **Discussion & Q&A**
- **POST `/api/courses/:id/discussions`**: Create a new discussion thread in a course.
- **GET `/api/courses/:id/discussions`**: Get a list of discussion threads in a course.
- **POST `/api/discussions/:discussionId/replies`**: Add a reply to a discussion thread.
- **GET `/api/discussions/:discussionId/replies`**: Get all replies to a discussion thread.

### 7. **Reviews & Ratings**
- **POST `/api/courses/:id/reviews`**: Add a review and rating for a course.
- **GET `/api/courses/:id/reviews`**: Get a list of reviews for a course.
- **PUT `/api/courses/:id/reviews/:reviewId`**: Update a review by ID.
- **DELETE `/api/courses/:id/reviews/:reviewId`**: Delete a review by ID.

### 8. **Notifications**
- **GET `/api/notifications`**: Get a list of notifications for the authenticated user.
- **PUT `/api/notifications/:id/read`**: Mark a notification as read.

### 9. **Admin Management**                                 ----------> Done 
- **GET `/api/admin/users`**: Get a list of all users (Admin only).
- **DELETE `/api/admin/users/:id`**: Delete a user by ID (Admin only).
- **GET `/api/admin/courses`**: Get a list of all courses (Admin only).
- **DELETE `/api/admin/courses/:id`**: Delete a course by ID (Admin only).
- **GET `/api/admin/reports`**: Get site-wide reports and analytics (Admin only).

### 10. **Miscellaneous**
- **GET `/api/categories`**: Get a list of all course categories.
- **GET `/api/instructors`**: Get a list of all instructors.
- **GET `/api/tags`**: Get a list of all tags used in courses.

### **11. Product Management**                     ---------------> DONE
- **POST `/api/products`**: Add a new product (Admin only).
- **GET `/api/products`**: Get a list of all products.
- **GET `/api/products/:id`**: Get details of a specific product by ID.
- **PUT `/api/products/:id`**: Update a product by ID (Admin only).
- **DELETE `/api/products/:id`**: Delete a product by ID (Admin only).
- **GET `/api/products/category/:category`**: Get products by category.
- **POST `/api/products/:id/review`**: Add a review and rating for a product.
- **GET `/api/products/:id/reviews`**: Get a list of reviews for a product.
- **PUT `/api/products/:id/reviews/:reviewId`**: Update a review by ID (Admin only).
- **DELETE `/api/products/:id/reviews/:reviewId`**: Delete a review by ID (Admin only).
