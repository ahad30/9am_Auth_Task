const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getShopByName = async (req, res) => {
  try {
    const { shopName } = req.params;
    
    const shop = await prisma.shop.findUnique({
      where: { name: shopName.toLowerCase() },
      include: { user: { select: { username: true } } }
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    res.json({
      success: true,
      shop: {
        id: shop.id,
        name: shop.name,
        owner: shop.user.username,
        createdAt: shop.createdAt
      }
    });
  } catch (error) {
    console.error('Get shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getUserShops = async (req, res) => {
  try {
    const shops = await prisma.shop.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'asc' }
    });

    res.json({
      success: true,
      shops: shops.map(shop => ({ id: shop.id, name: shop.name }))
    });
  } catch (error) {
    console.error('Get user shops error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getShopByName,
  getUserShops
};