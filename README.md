# StyleHub - Clothing Shopping Website

A modern, responsive clothing shopping website built with Next.js and Tailwind CSS.

## 👥 Team Members

- **Win Yu Maung**
- **Sam Yati**
- **Phonvan Deelertpattana**


## Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: Tailwind CSS 4
- **Icons**: Heroicons (SVG)
- **Images**: Unsplash (placeholder images)

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   ├── ProductCard.jsx # Product display card
│   ├── Cart.jsx        # Shopping cart modal
│   └── Footer.jsx      # Site footer
├── api/                # API routes
│   ├── clothes/        # Product data endpoints
│   ├── users/          # User management
│   └── sales/          # Order processing
├── products/           # Products page
├── layout.js          # Root layout
├── page.js            # Homepage
└── globals.css        # Global styles
```

## API Endpoints

- `GET /api/clothes` - Fetch all products
- `POST /api/clothes` - Add new product
- `GET /api/users` - Fetch all users
- `POST /api/users` - Create new user
- `GET /api/sales` - Fetch all sales
- `POST /api/sales` - Create new sale

## Sample Products

The application comes with 8 sample clothing items including:

- Classic White T-Shirt
- Denim Jacket
- Black Jeans
- Floral Summer Dress
- Casual Hoodie
- Leather Boots
- Striped Blouse
- Wool Sweater

## Features in Detail

### Homepage

- Hero section with call-to-action
- Featured products grid
- Service highlights (Free Shipping, Quality Guarantee, Fast Delivery)
- Responsive navigation

### Products Page

- Category filtering
- Price sorting (low to high, high to low)
- Product grid with detailed cards
- Add to cart functionality

### Shopping Cart

- Side panel cart with item management
- Quantity adjustment
- Item removal
- Checkout process with user information

### Responsive Design

- Mobile-first approach
- Collapsible navigation menu
- Optimized product grid for different screen sizes
- Touch-friendly interface

## Customization

### Adding New Products

Products can be added via the API or by modifying the sample data in `app/api/clothes/route.js`.

### Styling

The application uses Tailwind CSS for styling. Customize colors, spacing, and components by modifying the Tailwind classes in the component files.

### Branding

Update the brand name, colors, and logo by modifying:

- `app/layout.js` - Site title and metadata
- `app/components/Header.jsx` - Logo and brand colors
- `app/components/Footer.jsx` - Footer branding

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment

- Node.js 18+ required
- Modern browser with ES6+ support

## License

This project is created for educational purposes.
