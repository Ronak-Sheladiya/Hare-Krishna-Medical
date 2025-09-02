import { supabase } from '../config/supabase';

class SupabaseService {
  // Generic CRUD operations
  async create(table, data) {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  async getAll(table, options = {}) {
    let query = supabase.from(table).select('*');
    
    if (options.orderBy) {
      query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending });
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getById(table, id) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(table, id, data) {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  async delete(table, id) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Specific methods for common operations
  async getProducts() {
    return this.getAll('products', { 
      orderBy: { column: 'created_at', ascending: false } 
    });
  }

  async getOrders() {
    return this.getAll('orders', { 
      orderBy: { column: 'created_at', ascending: false } 
    });
  }

  async getUsers() {
    return this.getAll('users', { 
      orderBy: { column: 'created_at', ascending: false } 
    });
  }

  async getInvoices() {
    return this.getAll('invoices', { 
      orderBy: { column: 'created_at', ascending: false } 
    });
  }
}

export default new SupabaseService();