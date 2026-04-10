const { Op } = require('sequelize');
const { Category } = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');
const slugify = require('../utils/slugify');

// @desc    Get all active categories (public)
// @route   GET /api/categories
// @access  Public
const getCategories = catchAsync(async (req, res) => {
  const categories = await Category.findAll({
    where: { isActive: true },
    order: [['sortOrder', 'ASC'], ['name', 'ASC']],
    include: [{
      model: Category,
      as: 'children',
      where: { isActive: true },
      required: false,
    }],
  });
  return ApiResponse.success(res, { categories });
});

// @desc    Get all categories including inactive (admin)
// @route   GET /api/categories/all
// @access  Private/Admin
const getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.findAll({
    order: [['sortOrder', 'ASC'], ['name', 'ASC']],
    include: [{
      model: Category,
      as: 'parent',
      attributes: ['id', 'name'],
    }],
  });
  return ApiResponse.success(res, { categories });
});

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Private/Admin
const getCategoryById = catchAsync(async (req, res) => {
  const category = await Category.findByPk(req.params.id, {
    include: [
      { model: Category, as: 'parent', attributes: ['id', 'name'] },
      { model: Category, as: 'children', attributes: ['id', 'name'] },
    ],
  });
  if (!category) {
    return ApiResponse.notFound(res, 'Danh mục không tồn tại');
  }
  return ApiResponse.success(res, { category });
});

// @desc    Get category by slug (public)
// @route   GET /api/categories/slug/:slug
// @access  Public
const getCategoryBySlug = catchAsync(async (req, res) => {
  const category = await Category.findOne({
    where: { slug: req.params.slug },
    include: [{
      model: Category,
      as: 'children',
      where: { isActive: true },
      required: false,
    }],
  });
  if (!category) {
    return ApiResponse.notFound(res, 'Danh mục không tồn tại');
  }
  return ApiResponse.success(res, { category });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = catchAsync(async (req, res) => {
  const { name, description, image, parentId, isActive, sortOrder } = req.body;

  // Auto-generate slug if not provided
  let slug = req.body.slug;
  if (!slug && name) {
    slug = slugify(name);
    // Ensure uniqueness
    let existing = await Category.findOne({ where: { slug } });
    let counter = 1;
    while (existing) {
      slug = `${slugify(name)}-${counter}`;
      existing = await Category.findOne({ where: { slug } });
      counter++;
    }
  }

  const category = await Category.create({
    name,
    slug,
    description,
    image,
    parentId: parentId || null,
    isActive: isActive !== undefined ? isActive : true,
    sortOrder: sortOrder || 0,
  });

  return ApiResponse.created(res, { category }, 'Tạo danh mục thành công');
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = catchAsync(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    return ApiResponse.notFound(res, 'Danh mục không tồn tại');
  }

  const allowed = ['name', 'slug', 'description', 'image', 'parentId', 'isActive', 'sortOrder'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      category[key] = req.body[key];
    }
  }

  await category.save();
  return ApiResponse.success(res, { category }, 'Cập nhật danh mục thành công');
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = catchAsync(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    return ApiResponse.notFound(res, 'Danh mục không tồn tại');
  }

  await category.destroy();
  return ApiResponse.success(res, null, 'Xóa danh mục thành công');
});

module.exports = {
  getCategories,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
