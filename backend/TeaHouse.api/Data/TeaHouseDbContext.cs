using Microsoft.EntityFrameworkCore;
using TeaHouse.api.Models;

namespace TeaHouse.Api.Data
{
    public partial class TeaHouseDbContext : DbContext
    {
        public TeaHouseDbContext(DbContextOptions<TeaHouseDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Banner> Banners { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Discount> Discounts { get; set; }
        public virtual DbSet<FeaturedNews> FeaturedNews { get; set; }
        public virtual DbSet<Inventory> Inventories { get; set; }
        public virtual DbSet<Order> Orders { get; set; }
        public virtual DbSet<OrderItem> OrderItems { get; set; }
        public virtual DbSet<OrderStatusHistory> OrderStatusHistories { get; set; }
        public virtual DbSet<OrderTopping> OrderToppings { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<ProductImage> ProductImages { get; set; }
        public virtual DbSet<ProductTopping> ProductToppings { get; set; }
        public virtual DbSet<Review> Reviews { get; set; }
        public virtual DbSet<TableReservation> TableReservations { get; set; }
        public virtual DbSet<Topping> Toppings { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            

            modelBuilder.Entity<Banner>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.Property(e => e.image_url).HasMaxLength(255);
                entity.Property(e => e.link).HasMaxLength(255);
                entity.Property(e => e.title).HasMaxLength(150);
                entity.Property(e => e.is_active).HasDefaultValue(true);
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.Property(e => e.name).HasMaxLength(100);
                entity.Property(e => e.description).HasMaxLength(255);
                entity.Property(e => e.is_active).HasDefaultValue(true);
            });

            modelBuilder.Entity<Discount>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.HasIndex(e => e.code).IsUnique();
                entity.Property(e => e.code).HasMaxLength(50);
                entity.Property(e => e.discount_type).HasMaxLength(50);
                entity.Property(e => e.value).HasColumnType("decimal(10,2)");
                entity.Property(e => e.start_date).HasColumnType("datetime");
                entity.Property(e => e.end_date).HasColumnType("datetime");
                entity.Property(e => e.is_active).HasDefaultValue(true);
            });

            modelBuilder.Entity<FeaturedNews>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.Property(e => e.title).HasMaxLength(200);
                entity.Property(e => e.slug).HasMaxLength(200);
                entity.Property(e => e.short_description).HasMaxLength(500);
                entity.Property(e => e.thumbnail).HasMaxLength(255);
                entity.Property(e => e.created_at).HasDefaultValueSql("getdate()");
                entity.Property(e => e.updated_at).HasColumnType("datetime");
                entity.Property(e => e.is_active).HasDefaultValue(true);

                entity.HasOne(d => d.created_byNavigation)
                      .WithMany(p => p.FeaturedNews)
                      .HasForeignKey(d => d.created_by);

                entity.HasOne(d => d.drink)
                      .WithMany(p => p.FeaturedNews)
                      .HasForeignKey(d => d.drink_id);
            });

            modelBuilder.Entity<Inventory>(entity =>
            {
                entity.ToTable("Inventory");
                entity.HasKey(e => e.id);
                entity.Property(e => e.last_update).HasDefaultValueSql("getdate()");
                entity.Property(e => e.is_active).HasDefaultValue(true);

                entity.HasOne(d => d.product)
                      .WithMany(p => p.Inventories)
                      .HasForeignKey(d => d.product_id);
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.Property(e => e.total).HasColumnType("decimal(10,2)");
                entity.Property(e => e.status).HasMaxLength(50);
                entity.Property(e => e.created_at).HasDefaultValueSql("getdate()");

                entity.HasOne(d => d.user)
                      .WithMany(p => p.Orders)
                      .HasForeignKey(d => d.user_id);

                entity.HasOne(d => d.discount)
                      .WithMany(p => p.Orders)
                      .HasForeignKey(d => d.discount_id);
            });

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.Property(e => e.price).HasColumnType("decimal(10,2)");

                entity.HasOne(d => d.order)
                      .WithMany(p => p.OrderItems)
                      .HasForeignKey(d => d.order_id);

                entity.HasOne(d => d.product)
                      .WithMany(p => p.OrderItems)
                      .HasForeignKey(d => d.product_id);
            });

            modelBuilder.Entity<OrderStatusHistory>(entity =>
            {
                entity.ToTable("OrderStatusHistory");
                entity.HasKey(e => e.id);
                entity.Property(e => e.status).HasMaxLength(50);
                entity.Property(e => e.updated_at).HasDefaultValueSql("getdate()");

                entity.HasOne(d => d.order)
                      .WithMany(p => p.OrderStatusHistories)
                      .HasForeignKey(d => d.order_id);

                entity.HasOne(d => d.updated_byNavigation)
                      .WithMany(p => p.OrderStatusHistories)
                      .HasForeignKey(d => d.updated_by);
            });

            modelBuilder.Entity<OrderTopping>(entity =>
            {
                entity.HasKey(e => e.id);

                entity.HasOne(d => d.order_item)
                      .WithMany(p => p.OrderToppings)
                      .HasForeignKey(d => d.order_item_id);

                entity.HasOne(d => d.topping)
                      .WithMany(p => p.OrderToppings)
                      .HasForeignKey(d => d.topping_id);
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.Property(e => e.name).HasMaxLength(150);
                entity.Property(e => e.description).HasMaxLength(255);
                entity.Property(e => e.image).HasMaxLength(255);
                entity.Property(e => e.price).HasColumnType("decimal(10,2)");
                entity.Property(e => e.status).HasMaxLength(50);
                entity.Property(e => e.is_active).HasDefaultValue(true);

                entity.HasOne(d => d.category)
                      .WithMany(p => p.Products)
                      .HasForeignKey(d => d.category_id);

            });

            modelBuilder.Entity<ProductImage>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.Property(e => e.image_url).HasMaxLength(255);
                entity.Property(e => e.is_main).HasDefaultValue(false);
                entity.Property(e => e.is_active).HasDefaultValue(true);

                entity.HasOne(d => d.product)
                      .WithMany(p => p.ProductImages)
                      .HasForeignKey(d => d.product_id);
            });

            modelBuilder.Entity<ProductTopping>(entity =>
            {
                entity.HasKey(e => e.id);

                entity.HasOne(d => d.product)
                      .WithMany(p => p.ProductToppings)
                      .HasForeignKey(d => d.product_id);

                entity.HasOne(d => d.topping)
                      .WithMany(p => p.ProductToppings)
                      .HasForeignKey(d => d.topping_id);
            });

            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.Property(e => e.comment).HasMaxLength(255);
                entity.Property(e => e.created_at).HasDefaultValueSql("getdate()");
                entity.Property(e => e.is_approved).HasDefaultValue(false);

                entity.HasOne(d => d.product)
                      .WithMany(p => p.Reviews)
                      .HasForeignKey(d => d.product_id);

                entity.HasOne(d => d.user)
                      .WithMany(p => p.Reviews)
                      .HasForeignKey(d => d.user_id);
            });

            modelBuilder.Entity<TableReservation>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.Property(e => e.customer_name).HasMaxLength(100);
                entity.Property(e => e.phone).HasMaxLength(20);
                entity.Property(e => e.email).HasMaxLength(150);
                entity.Property(e => e.note).HasMaxLength(255);
                entity.Property(e => e.status).HasMaxLength(50);
                entity.Property(e => e.created_at).HasDefaultValueSql("getdate()");

                entity.HasOne(d => d.user)
                      .WithMany(p => p.TableReservations)
                      .HasForeignKey(d => d.user_id);
            });

            modelBuilder.Entity<Topping>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.Property(e => e.name).HasMaxLength(100);
                entity.Property(e => e.price).HasColumnType("decimal(10,2)");
                entity.Property(e => e.is_active).HasDefaultValue(true);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.id);
                entity.HasIndex(e => e.email).IsUnique();
                entity.Property(e => e.name).HasMaxLength(100);
                entity.Property(e => e.email).HasMaxLength(150);
                entity.Property(e => e.password).HasMaxLength(255);
                entity.Property(e => e.role).HasMaxLength(50);
                entity.Property(e => e.is_active).HasDefaultValue(true);
                entity.Property(e => e.created_at).HasDefaultValueSql("getdate()");
            });
        }
    }
}
