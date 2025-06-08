# Setting Up the Express App

## 1. Configure Your Application

1. **Set Up Environment Variables**:  
   Create a `.env` file in your project directory and add the following line:

   ```env
   DATABASE_URL=<Your DB Server Instance URI>
   ```

   Replace `<Your DB Server Instance URI>` with the connection URI from your DB setup (local or cloud).

2. **Install Dependencies**:  
   Run the following command to install dependencies (assuming you're using `pnpm`):

   ```bash
   pnpm install
   ```

3. **Start the Application**:  
   Start the development server with:
   ```bash
   pnpm dev
   ```

---

## 2. Access the API

Once the server is running, visit the following URL in your browser or API client:  
[http://localhost:5000/auth/ping](http://localhost:5000/auth/ping)
